import React, { useCallback, useState } from 'react';
import {
    Button,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { bugReportStyles } from '@/features/configure/bugReport/views/pages/styles';

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
                    <View style={bugReportStyles.modalContent}>
                        <Text>却下理由を入力してください</Text>
                        <TextInput
                            style={bugReportStyles.input}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            multiline
                        />
                        <View style={bugReportStyles.buttonContainer}>
                            <Button title="キャンセル" onPress={closeModal} />
                            <Button title="確定" onPress={confirmReject} />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    },
);

export default HiddenItemWithModal;
