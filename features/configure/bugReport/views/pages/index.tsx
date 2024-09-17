import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    SectionListData,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useBugReportQuery } from '@/features/configure/bugReport/queries/useBugReportQuery';
import { useBugReportUsecase } from '@/features/configure/bugReport/usecases/useBugReportUsecase';
import BugReportContainer from '@/features/configure/bugReport/views/components/BugReportContainer';
import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import BugReportEditModal from '@/features/configure/bugReport/views/components/BugReportEditModal';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { bugReportStyles } from '@/features/configure/bugReport/views/pages/styles';
import HiddenItemWithModal from '@/features/configure/bugReport/views/components/HiddenItemWithModal';

export default function BugReport() {
    const { sections, refreshing } = useBugReportQuery();
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
                    <View style={sharedStyles.rowBack}>
                        {canReject && (
                            <HiddenItemWithModal
                                item={item}
                                onReject={handleRejectBugReport}
                            />
                        )}
                    </View>
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
                    <TouchableOpacity
                        style={bugReportStyles.addButton}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>
                {modalVisible && (
                    <BugReportEditModal
                        addBugReport={handleAddBugReport}
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                )}

                <SwipeListView
                    useSectionList
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#5cb85c']}
                            tintColor="#5cb85c"
                        />
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
}
