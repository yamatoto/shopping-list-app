import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, SectionListData } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeRow } from 'react-native-swipe-list-view';

import CommonSwipeListView from '@/shared/components/CommonSwipeListView';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useBugReportQuery } from '@/features/configure/bugReport/queries/useBugReportQuery';
import { useBugReportUsecase } from '@/features/configure/bugReport/usecases/useBugReportUsecase';
import BugReportContainer from '@/features/configure/bugReport/views/components/BugReportContainer';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { bugReportStyles } from '@/features/configure/bugReport/views/pages/styles';
import HiddenItemWithModal from '@/features/configure/bugReport/views/components/HiddenItemWithModal';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import {
    BUF_REPORT_PRIORITY,
    DisplayBugReport,
} from '@/shared/models/requestModel';
import RequestEditModal from '@/shared/components/RequestEditModal';
import ButtonAdd from '@/shared/components/ButtonAdd';
import Loading from '@/shared/components/Loading';

export default function BugReport() {
    const { bugReportsSections, refreshing } = useBugReportQuery();
    const {
        initialize,
        handleRefresh,
        handleAddBugReport,
        handleUpdateBugReport,
        handleCompleteBugReportCheckToggle,
        handleRejectBugReport,
    } = useBugReportUsecase();
    const [modalVisible, setModalVisible] = useState(false);
    const { currentUser } = useFirebaseAuth();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayBugReport }) => {
            const canReject =
                currentUser?.isDeveloper && !item.completed && !item.rejected;
            return (
                // @ts-ignore
                <SwipeRow
                    rightOpenValue={canReject ? -75 : 0}
                    disableRightSwipe={true}
                    disableLeftSwipe={!canReject}
                    swipeToOpenPercent={30}
                >
                    {canReject ? (
                        <HiddenItemWithModal
                            item={item}
                            onReject={handleRejectBugReport}
                        />
                    ) : (
                        <EmptyComponent />
                    )}
                    <View style={bugReportStyles.rowFront}>
                        <BugReportContainer
                            bugReport={item}
                            handleCompleteBugReportCheckToggle={
                                handleCompleteBugReportCheckToggle
                            }
                            updateBugReport={updated =>
                                handleUpdateBugReport(item, updated)
                            }
                        />
                    </View>
                </SwipeRow>
            );
        },
        [
            currentUser?.isDeveloper,
            handleCompleteBugReportCheckToggle,
            handleUpdateBugReport,
            handleRejectBugReport,
        ],
    );

    const renderSectionHeader = useCallback(
        ({
            section: { title },
        }: {
            section: SectionListData<DisplayBugReport>;
        }) => (
            <View style={bugReportStyles.sectionHeader}>
                <Text style={bugReportStyles.sectionHeaderText}>{title}</Text>
            </View>
        ),
        [],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={bugReportStyles.addButtonContainer}>
                    <ButtonAdd
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    />
                </View>

                {bugReportsSections[0].data.length === 0 ? (
                    <Loading />
                ) : (
                    <CommonSwipeListView
                        useSectionList
                        sections={bugReportsSections}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        refreshing={refreshing}
                        handleRefresh={handleRefresh}
                    />
                )}
            </View>

            {modalVisible && (
                <RequestEditModal
                    contentLabel="バグ内容"
                    addRequest={handleAddBugReport}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    priorities={BUF_REPORT_PRIORITY}
                />
            )}
        </GestureHandlerRootView>
    );
}
