import React, { useState } from 'react';

import {
    DisplayFeatureRequest,
    PRIORITY,
    PriorityValue,
} from '@/features/configure/featureRequest/models/featureRequestModel';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import Modal from '@/shared/components/Modal';
import ModalTextArea from '@/shared/components/ModalTextArea';
import ModalPickerSelect from '@/shared/components/ModalPickerSelect';
import ModalHorizontalButtons from '@/shared/components/ModalHorizontalButtons';

type Props = {
    featureRequest?: DisplayFeatureRequest;
    addFeatureRequest?: (content: string, priority: PriorityValue) => void;
    updateFeatureRequest?: (
        updatedItem: Partial<DisplayFeatureRequest>,
    ) => void;
    visible: boolean;
    onClose: () => void;
};

export default function FeatureRequestEditModal({
    featureRequest,
    addFeatureRequest,
    updateFeatureRequest,
    visible,
    onClose,
}: Props) {
    const { currentUser } = useFirebaseAuth();
    const [selectedPriority, setSelectedPriority] = useState(
        featureRequest?.priority || PRIORITY.HIGH.value,
    );

    const [tempContent, setTempContent] = useState(
        featureRequest?.content ?? '',
    );
    const [tempRejectedReason, setTempRejectedReason] = useState(
        featureRequest?.rejectedReason ?? '',
    );

    const handleConfirm = async () => {
        if (addFeatureRequest) {
            addFeatureRequest(tempContent, selectedPriority);
        }
        if (updateFeatureRequest) {
            updateFeatureRequest({
                content: tempContent,
                rejectedReason: tempRejectedReason,
                priority: selectedPriority,
            });
        }
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <ModalTextArea
                label="実装要望内容"
                value={tempContent}
                onChangeText={setTempContent}
                placeholder="実装要望の内容を入力"
            />
            {!featureRequest?.rejected && !featureRequest?.completed && (
                <ModalPickerSelect
                    label="優先度"
                    value={selectedPriority}
                    items={Object.values(PRIORITY)}
                    onValueChange={setSelectedPriority}
                    disabled={!currentUser?.isDeveloper}
                />
            )}
            {featureRequest?.rejected && (
                <ModalTextArea
                    label="却下理由"
                    value={tempRejectedReason}
                    onChangeText={setTempRejectedReason}
                    placeholder="却下理由を入力"
                    editable={currentUser?.isDeveloper}
                />
            )}
            <ModalHorizontalButtons
                onCancel={onClose}
                onSubmit={handleConfirm}
            />
        </Modal>
    );
}
