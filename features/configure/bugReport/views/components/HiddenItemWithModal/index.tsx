import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import ModalTextArea from '@/shared/components/ModalTextArea';
import { DisplayBugReport } from '@/features/configure/bugReport/models/bugReportModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import Modal from '@/shared/components/Modal';
import ModalHorizontalButtons from '@/shared/components/ModalHorizontalButtons';
type Props = {
    item: DisplayBugReport;
    onReject: (item: DisplayBugReport) => void;
};
const HiddenItemWithModal = React.memo(({ item, onReject }: Props) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState(item.rejectedReason);

    const confirmReject = useCallback(() => {
        onReject({ ...item, rejectedReason: rejectReason.trim() });
        setModalVisible(false);
    }, [item, rejectReason, onReject]);

    return (
        <TouchableOpacity
            style={sharedStyles.backRightBtn}
            onPress={() => setModalVisible(true)}
        >
            <Text style={sharedStyles.backTextWhite}>却下</Text>
            <Modal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
            >
                <ModalTextArea
                    label="却下理由"
                    value={rejectReason}
                    onChangeText={setRejectReason}
                    placeholder="却下理由を入力"
                />
                <ModalHorizontalButtons
                    onCancel={() => setModalVisible(false)}
                    onSubmit={confirmReject}
                />
            </Modal>
        </TouchableOpacity>
    );
});

export default HiddenItemWithModal;
