import React, { useCallback, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { modalStyles } from '@/shared/styles/modalStyles';
import SubmitButton from '@/shared/components/SubmitButton';

const HiddenItemWithModal = React.memo(
    ({
        item,
        onReject,
    }: {
        item: DisplayBugReport;
        onReject: (item: DisplayBugReport) => void;
    }) => {
        const [isModalVisible, setModalVisible] = useState(false);
        const [rejectReason, setRejectReason] = useState(item.rejectedReason);

        const openModal = useCallback(() => {
            setModalVisible(true);
        }, []);

        const closeModal = useCallback(() => {
            setModalVisible(false);
        }, []);

        const confirmReject = useCallback(() => {
            if (rejectReason.trim() !== '') {
                onReject({ ...item, rejectedReason: rejectReason });
                closeModal();
            }
        }, [item, rejectReason, onReject, closeModal]);

        return (
            <TouchableOpacity
                style={sharedStyles.backRightBtn}
                onPress={openModal}
            >
                <Text style={sharedStyles.backTextWhite}>却下</Text>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <TouchableOpacity
                        style={modalStyles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={closeModal}
                    >
                        <View style={modalStyles.modalView}>
                            <Text style={modalStyles.modalTitle}>
                                却下理由を入力してください
                            </Text>
                            <TextInput
                                style={[modalStyles.input]}
                                multiline
                                numberOfLines={4}
                                value={rejectReason}
                                onChangeText={setRejectReason}
                                placeholder="却下理由を入力..."
                            />
                            <View style={modalStyles.buttonContainer}>
                                <TouchableOpacity
                                    style={modalStyles.button}
                                    onPress={closeModal}
                                >
                                    <Text style={modalStyles.buttonText}>
                                        キャンセル
                                    </Text>
                                </TouchableOpacity>
                                <SubmitButton
                                    title="確定"
                                    onPress={confirmReject}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </TouchableOpacity>
        );
    },
);

export default HiddenItemWithModal;
