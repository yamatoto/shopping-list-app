import React, { useState } from 'react';

import Modal from '@/shared/components/Modal';
import { DisplayCategory } from '@/features/configure/category/models/categoryModel';
import ModalTextArea from '@/shared/components/ModalTextArea';
import ModalHorizontalButtons from '@/shared/components/ModalHorizontalButtons';

type Props = {
    category?: DisplayCategory;
    updateCategory: (updatedCategoryName: string) => void;
    visible: boolean;
    onClose: () => void;
};

export default function CategoryEditModal({
    category,
    updateCategory,
    visible,
    onClose,
}: Props) {
    const [tempName, setTempName] = useState(category?.name ?? '');

    return (
        <Modal visible={visible} onClose={onClose}>
            <ModalTextArea
                label="カテゴリー名"
                value={tempName}
                onChangeText={setTempName}
                placeholder="カテゴリー名を入力"
            />
            <ModalHorizontalButtons
                onCancel={onClose}
                onSubmit={() => updateCategory(tempName)}
            />
        </Modal>
    );
}
