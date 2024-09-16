import React, { useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { modalStyles } from '@/shared/styles/modalStyles';
import SubmitButton from '@/shared/components/SubmitButton';
import Modal from '@/shared/components/Modal';

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

        const onClose = useCallback(() => {
            setModalVisible(false);
        }, []);

        const confirmReject = useCallback(() => {
            if (rejectReason.trim() !== '') {
                onReject({ ...item, rejectedReason: rejectReason });
                onClose();
            }
        }, [item, rejectReason, onReject, onClose]);

        return (
            <TouchableOpacity
                style={sharedStyles.backRightBtn}
                onPress={openModal}
            >
                <Text style={sharedStyles.backTextWhite}>却下</Text>
                <Modal visible={isModalVisible} onClose={onClose}>
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
                            onPress={onClose}
                        >
                            <Text style={modalStyles.buttonText}>
                                キャンセル
                            </Text>
                        </TouchableOpacity>
                        <SubmitButton title="確定" onPress={confirmReject} />
                    </View>
                </Modal>
            </TouchableOpacity>
        );
    },
);

export default HiddenItemWithModal;
