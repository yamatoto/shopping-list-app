import React, { useCallback, useState } from 'react';

import ModalTextArea from '@/shared/components/ModalTextArea';
import Modal from '@/shared/components/Modal';
import ModalButtonContainerHorizontal from '@/shared/components/ModalButtonContainerHorizontal';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import { DisplayBugReport } from '@/shared/models/requestModel';

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

    const modalContent = (
        <Modal visible={true} onClose={() => setModalVisible(false)}>
            <ModalTextArea
                label="却下理由"
                value={rejectReason}
                onChangeText={setRejectReason}
                placeholder="却下理由を入力"
            />
            <ModalButtonContainerHorizontal
                onCancel={() => setModalVisible(false)}
                onSubmit={confirmReject}
            />
        </Modal>
    );

    return (
        <HiddenDeleteButton
            onPress={() => setModalVisible(true)}
            buttonText="却下"
            isModalVisible={isModalVisible}
            modalContent={modalContent}
        />
    );
});

export default HiddenItemWithModal;
