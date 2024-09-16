import React, { useState } from 'react';

import {
    DisplayBugReport,
    PRIORITY,
    PriorityValue,
} from '@/features/configure/bugReport/models/bugReportModel';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import Modal from '@/shared/components/Modal';
import ModalTextArea from '@/shared/components/ModalTextArea';
import ModalPickerSelect from '@/shared/components/ModalPickerSelect';
import ModalHorizontalButtons from '@/shared/components/ModalHorizontalButtons';

type Props = {
    bugReport?: DisplayBugReport;
    addBugReport?: (content: string, priority: PriorityValue) => void;
    updateBugReport?: (updatedItem: Partial<DisplayBugReport>) => void;
    visible: boolean;
    onClose: () => void;
};

export default function BugReportEditModal({
    bugReport,
    addBugReport,
    updateBugReport,
    visible,
    onClose,
}: Props) {
    const { currentUser } = useFirebaseAuth();
    const [selectedPriority, setSelectedPriority] = useState(
        bugReport?.priority || PRIORITY.HIGH.value,
    );

    const [tempContent, setTempContent] = useState(bugReport?.content ?? '');
    const [tempRejectedReason, setTempRejectedReason] = useState(
        bugReport?.rejectedReason ?? '',
    );

    const handleConfirm = async () => {
        if (addBugReport) {
            addBugReport(tempContent, selectedPriority);
        }
        if (updateBugReport) {
            updateBugReport({
                content: tempContent,
                rejectedReason: tempRejectedReason,
                priority: selectedPriority,
            });
        }
        onClose();
    };

    const handleContentChange = (text: string) => {
        setTempContent(text);
    };
    const handleRejectedReasonChange = (text: string) => {
        setTempRejectedReason(text);
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <ModalTextArea
                label="バグ内容"
                value={tempContent}
                onChangeText={handleContentChange}
                placeholder="バグ内容を入力"
            />
            {!bugReport?.rejected && (
                <ModalPickerSelect
                    label="優先度"
                    value={selectedPriority}
                    items={Object.values(PRIORITY)}
                    onValueChange={setSelectedPriority}
                    disabled={!currentUser?.isDeveloper}
                />
            )}
            {bugReport?.rejected && (
                <ModalTextArea
                    label="却下理由"
                    value={tempRejectedReason}
                    onChangeText={handleRejectedReasonChange}
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
