import React, { useState } from 'react';

import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import Modal from '@/shared/components/Modal';
import ModalTextArea from '@/shared/components/ModalTextArea';
import ModalPickerSelect from '@/shared/components/ModalPickerSelect';
import ModalButtonContainerHorizontal from '@/shared/components/ModalButtonContainerHorizontal';
import ModalButtonContainerViewOnly from '@/shared/components/ModalButtonContainerViewOnly';
import ModalTextView from '@/shared/components/ModalTextView';
import {
    BugReportPriorityValue,
    DisplayRequest,
    FeatureRequestPriorityValue,
    PriorityItem,
} from '@/shared/models/requestModel';

type ContentLabel = '実装要望内容' | 'バグ内容';
interface ForPartnerModalProps<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
> {
    contentLabel: ContentLabel;
    request?: DisplayRequest<T>;
    tempContent: string;
    setTempContent: (value: string) => void;
    tempRejectedReason: string;
    onClose: () => void;
    handleConfirm: () => void;
}
const ForPartnerModal = <
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
>({
    contentLabel,
    request,
    tempContent,
    setTempContent,
    tempRejectedReason,
    onClose,
    handleConfirm,
}: ForPartnerModalProps<T>) => {
    if (request?.rejected || request?.completed) {
        return (
            <>
                <ModalTextView label={contentLabel} value={tempContent} />
                {request?.rejected && (
                    <ModalTextView
                        label="却下理由"
                        value={tempRejectedReason}
                    />
                )}
                <ModalButtonContainerViewOnly onClose={onClose} />
            </>
        );
    }

    return (
        <>
            <ModalTextArea
                label={contentLabel}
                value={tempContent}
                onChangeText={setTempContent}
                placeholder="実装要望の内容を入力"
            />
            <ModalButtonContainerHorizontal
                onCancel={onClose}
                onSubmit={handleConfirm}
                submitText={request ? '更新' : '登録'}
            />
        </>
    );
};

interface ForDeveloperModalProps<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
    E extends Record<string, PriorityItem<T>>,
> extends ForPartnerModalProps<T> {
    priorities: E;
    selectedPriority: T;
    setSelectedPriority: (value: T) => void;
    tempRejectedReason: string;
    setTempRejectedReason: (value: string) => void;
}
const ForDeveloperModal = <
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
    E extends Record<string, PriorityItem<T>>,
>({
    priorities,
    contentLabel,
    request,
    tempContent,
    setTempContent,
    selectedPriority,
    setSelectedPriority,
    tempRejectedReason,
    setTempRejectedReason,
    onClose,
    handleConfirm,
}: ForDeveloperModalProps<T, E>) => {
    return (
        <>
            <ModalTextArea
                label={contentLabel}
                value={tempContent}
                onChangeText={setTempContent}
                placeholder={`${contentLabel}の内容を入力`}
            />
            <ModalPickerSelect
                label="優先度"
                value={selectedPriority}
                items={Object.values(priorities)}
                onValueChange={setSelectedPriority}
            />
            {request?.rejected && (
                <ModalTextArea
                    label="却下理由"
                    value={tempRejectedReason}
                    onChangeText={setTempRejectedReason}
                    placeholder="却下理由を入力"
                />
            )}
            <ModalButtonContainerHorizontal
                onCancel={onClose}
                onSubmit={handleConfirm}
                submitText={request ? '更新' : '登録'}
            />
        </>
    );
};

type Props<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
    E extends Record<string, PriorityItem<T>>,
> = {
    contentLabel: ContentLabel;
    request?: DisplayRequest<T>;
    addRequest?: (content: string, priority: T) => void;
    updateRequest?: (updatedItem: Partial<DisplayRequest<T>>) => void;
    visible: boolean;
    onClose: () => void;
    priorities: E;
};
export default function RequestEditModal<
    T extends FeatureRequestPriorityValue | BugReportPriorityValue,
    E extends Record<string, PriorityItem<T>>,
>({
    contentLabel,
    request,
    addRequest,
    updateRequest,
    visible,
    onClose,
    priorities,
}: Props<T, E>) {
    const { currentUser } = useFirebaseAuth();
    const [selectedPriority, setSelectedPriority] = useState(
        request?.priority || priorities.NOT_SET.value,
    );

    const [tempContent, setTempContent] = useState(request?.content ?? '');
    const [tempRejectedReason, setTempRejectedReason] = useState(
        request?.rejectedReason ?? '',
    );

    const handleConfirm = async () => {
        if (addRequest) {
            addRequest(tempContent, selectedPriority);
        }
        if (updateRequest) {
            updateRequest({
                content: tempContent,
                rejectedReason: tempRejectedReason,
                priority: selectedPriority,
            });
        }
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            {currentUser?.isDeveloper ? (
                <ForDeveloperModal
                    priorities={priorities}
                    contentLabel={contentLabel}
                    request={request}
                    tempContent={tempContent}
                    setTempContent={setTempContent}
                    selectedPriority={selectedPriority}
                    setSelectedPriority={setSelectedPriority}
                    tempRejectedReason={tempRejectedReason}
                    setTempRejectedReason={setTempRejectedReason}
                    onClose={onClose}
                    handleConfirm={handleConfirm}
                />
            ) : (
                <ForPartnerModal
                    contentLabel={contentLabel}
                    request={request}
                    tempContent={tempContent}
                    setTempContent={setTempContent}
                    tempRejectedReason={tempRejectedReason}
                    onClose={onClose}
                    handleConfirm={handleConfirm}
                />
            )}
        </Modal>
    );
}
