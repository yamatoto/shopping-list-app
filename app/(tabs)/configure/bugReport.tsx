import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
    Modal,
    SectionList,
    SectionListData,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TextInput, Button } from 'react-native';
import { IPropsSwipeRow, SwipeRow } from 'react-native-swipe-list-view';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useBugReportQuery } from '@/features/configure/bugReport/queries/useBugReportQuery';
import { useBugReportUsecase } from '@/features/configure/bugReport/usecases/useBugReportUsecase';
import BugReportContainer from '@/features/configure/bugReport/components/BugReportContainer';
import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import BugReportEditModal from '@/features/configure/bugReport/components/BugReportEditModal';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { DEVELOPER_EMAIL } from '@/shared/config/user';

const HiddenItemWithModal = React.memo(
    ({
        item,
        onReject,
    }: {
        item: DisplayBugReport;
        onReject: (item: DisplayBugReport, reason: string) => void;
    }) => {
        const [isModalVisible, setModalVisible] = useState(false);
        const [rejectReason, setRejectReason] = useState('');

        const openModal = useCallback(() => {
            setModalVisible(true);
        }, []);

        const closeModal = useCallback(() => {
            setModalVisible(false);
            setRejectReason('');
        }, []);

        const confirmReject = useCallback(() => {
            if (rejectReason.trim() !== '') {
                onReject(item, rejectReason);
                closeModal();
            }
        }, [item, rejectReason, onReject, closeModal]);

        return (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={openModal}
                >
                    <Text style={sharedStyles.backTextWhite}>却下</Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContent}>
                        <Text>却下理由を入力してください</Text>
                        <TextInput
                            style={styles.input}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            multiline
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="キャンセル" onPress={closeModal} />
                            <Button title="確定" onPress={confirmReject} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    },
);

export default function BugReportScreen() {
    const { bugReports, refreshing } = useBugReportQuery();
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
        initialize().then();
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
                        <View style={styles.rowBack}>
                            <HiddenItemWithModal
                                item={item}
                                onReject={handleRejectBugReport}
                            />
                        </View>
                    ) : null}
                    <View style={styles.rowFront}>
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

    const sections = useMemo(
        () => [
            {
                title: '未完了',
                data: bugReports.filter(
                    report => !report.completed && !report.rejected,
                ),
            },
            {
                title: '完了',
                data: bugReports.filter(report => report.completed),
            },
            {
                title: '却下',
                data: bugReports.filter(report => report.rejected),
            },
        ],
        [bugReports],
    );
    const renderSectionHeader = useCallback(
        ({
            section: { title },
        }: {
            section: SectionListData<DisplayBugReport>;
        }) => (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
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

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    input: {
        height: 100,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    sectionHeader: {
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
    },
    rowFront: {
        backgroundColor: 'white',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        right: 0,
        backgroundColor: 'red',
    },
    backTextWhite: {
        color: '#FFF',
    },
});
