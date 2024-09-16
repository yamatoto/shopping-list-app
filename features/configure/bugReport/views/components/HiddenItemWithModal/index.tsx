import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import ModalTextArea from '@/shared/components/ModalTextArea';
import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import Modal from '@/shared/components/Modal';
import ModalHorizontalButtons from '@/shared/components/ModalHorizontalButtons';

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
                    <ModalTextArea
                        label="却下理由"
                        value={rejectReason}
                        onChangeText={setRejectReason}
                        placeholder="却下理由を入力"
                    />
                    <ModalHorizontalButtons
                        onCancel={onClose}
                        onSubmit={confirmReject}
                    />
                </Modal>
            </TouchableOpacity>
        );
    },
);

export default HiddenItemWithModal;
