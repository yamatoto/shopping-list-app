import React, { useState } from 'react';

import Modal from '@/shared/components/Modal';
import ModalButtonContainerHorizontal from '@/shared/components/ModalButtonContainerHorizontal';
import { CategoryModel } from '@/shared/models/categorySortModel';
import ModalTextInput from '@/shared/components/ModalTextInput';

type Props = {
    category?: CategoryModel;
    onConfirm: (updatedCategoryName: string) => void;
    visible: boolean;
    onClose: () => void;
};

export default function CategoryEditModal({
    category,
    onConfirm,
    visible,
    onClose,
}: Props) {
    const [tempName, setTempName] = useState(category?.name ?? '');
    const handleConfirm = async () => {
        onConfirm(tempName);
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <ModalTextInput
                label="カテゴリー名"
                value={tempName}
                onChangeText={setTempName}
                placeholder="カテゴリー名を入力"
            />
            <ModalButtonContainerHorizontal
                onCancel={onClose}
                onSubmit={handleConfirm}
            />
        </Modal>
    );
}
