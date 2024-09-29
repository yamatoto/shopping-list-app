import React, { useState } from 'react';

import { DisplayItem } from '@/shared/models/itemModel';
import Modal from '@/shared/components/Modal';
import ModalButtonContainerHorizontal from '@/shared/components/ModalButtonContainerHorizontal';
import ModalPickerSelect from '@/shared/components/ModalPickerSelect';
import ModalTextInput from '@/shared/components/ModalTextInput';
import { SCREEN, ScreenLabel } from '@/features/shopping-list/constants/screen';
import { InputValues } from '@/features/shopping-list/models/form';
import QuantityInput from '@/features/shopping-list/views/components/QuantityInput';

type Props = {
    screenLabel: ScreenLabel;
    item: DisplayItem;
    categorySelectItems: { label: string; value: string }[];
    shoppingPlatformDetailSelectItems: { label: string; value: string }[];
    onConfirm: (values: InputValues) => void;
    visible: boolean;
    onClose: () => void;
};
export default function ShoppingItemEditModal({
    screenLabel,
    item,
    categorySelectItems,
    shoppingPlatformDetailSelectItems,
    onConfirm,
    visible,
    onClose,
}: Props) {
    const isCurrent = screenLabel === SCREEN.CURRENT;
    const [selectedCategory, setSelectedCategory] = useState(item.categoryId);
    const [selectedShoppingPlatformDetail, setSelectedShoppingPlatformDetail] =
        useState(item.shoppingPlatformDetailId);

    const [tempQuantity, setTempQuantity] = useState(item.quantity.toString());
    const [tempName, setTempName] = useState(item.name);

    const handleConfirm = async () => {
        onConfirm({
            quantity: tempQuantity,
            name: tempName,
            categoryId: selectedCategory,
            shoppingPlatformDetailId: selectedShoppingPlatformDetail,
        });
        onClose();
    };

    const handleNameChange = (text: string) => {
        setTempName(text);
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <ModalTextInput
                label="商品名"
                value={tempName}
                onChangeText={handleNameChange}
                placeholder="商品名を入力"
            />
            {isCurrent && (
                <QuantityInput
                    tempQuantity={tempQuantity}
                    setTempQuantity={setTempQuantity}
                />
            )}
            <ModalPickerSelect
                label="カテゴリ"
                value={selectedCategory}
                items={categorySelectItems}
                onValueChange={setSelectedCategory}
            />
            <ModalPickerSelect
                label="ショップ"
                value={selectedShoppingPlatformDetail}
                items={shoppingPlatformDetailSelectItems}
                onValueChange={setSelectedShoppingPlatformDetail}
            />
            <ModalButtonContainerHorizontal
                onCancel={onClose}
                onSubmit={handleConfirm}
            />
        </Modal>
    );
}
