import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    SectionList,
    SectionListData,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IPropsSwipeRow, SwipeRow } from 'react-native-swipe-list-view';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useBugReportQuery } from '@/features/configure/bugReport/queries/useBugReportQuery';
import { useBugReportUsecase } from '@/features/configure/bugReport/usecases/useBugReportUsecase';
import BugReportContainer from '@/features/configure/bugReport/views/components/BugReportContainer';
import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import BugReportEditModal from '@/features/configure/bugReport/views/components/BugReportEditModal';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { DEVELOPER_EMAIL } from '@/shared/config/user';
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
    const isDeveloper = currentUser?.email === DEVELOPER_EMAIL;

    useEffect(() => {
        initialize().catch(error => console.error('初期化エラー:', error));
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayBugReport }) => {
            const swipeRowProps: Partial<IPropsSwipeRow<DisplayBugReport>> = {
                rightOpenValue: isDeveloper ? -75 : 0,
                disableRightSwipe: true,
                disableLeftSwipe: !isDeveloper,
                swipeToOpenPercent: 30,
            };

            return (
                <SwipeRow<DisplayBugReport> {...swipeRowProps}>
                    {isDeveloper ? (
                        <View style={bugReportStyles.rowBack}>
                            <HiddenItemWithModal
                                item={item}
                                onReject={handleRejectBugReport}
                            />
                        </View>
                    ) : null}
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
            isDeveloper,
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
                <View style={sharedStyles.inputContainer}>
                    <TouchableOpacity
                        style={sharedStyles.addButton}
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

                <SectionList
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
                    stickySectionHeadersEnabled={false}
                />
            </View>
        </GestureHandlerRootView>
    );
}
