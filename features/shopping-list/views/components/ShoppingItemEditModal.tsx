import React, { useCallback, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { CATEGORIES } from '@/features/shopping-list/constants/category';
import Modal from '@/shared/components/Modal';
import { modalStyles } from '@/shared/styles/modalStyles';
import ModalHorizontalButtons from '@/shared/components/ModalHorizontalButtons';
import ModalPickerSelect from '@/shared/components/ModalPickerSelect';
import ModalTextInput from '@/shared/components/ModalTextInput';

type Props = {
    item: DisplayItem;
    updateItem: (updatedItem: Partial<DisplayItem>) => void;
    visible: boolean;
    onClose: () => void;
    isCurrent: boolean;
};

const CATEGORY_SELECT_ITEMS = CATEGORIES.map(text => ({
    label: text,
    value: text,
}));

export default function ShoppingItemEditModal({
    item,
    updateItem,
    visible,
    onClose,
    isCurrent,
}: Props) {
    const [selectedCategory, setSelectedCategory] = useState(
        item.category || CATEGORIES[0],
    );

    const [tempQuantity, setTempQuantity] = useState(item.quantity.toString());
    const [tempName, setTempName] = useState(item.name);
    const inputRef = useRef<TextInput>(null);

    const focusTextInputToEnd = useCallback(() => {
        if (inputRef.current) {
            setTimeout(() => {
                (inputRef.current as TextInput).setSelection(
                    tempQuantity.length,
                    tempQuantity.length,
                );
            }, 50);
        }
    }, [tempQuantity]);

    const handleQuantityChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setTempQuantity(numericValue || '1'); // 空の場合は '1' にする
    };

    const incrementQuantity = () => {
        const currentValue = parseInt(tempQuantity, 10);
        setTempQuantity((currentValue + 1).toString());
    };

    const decrementQuantity = () => {
        const currentValue = parseInt(tempQuantity, 10);
        if (currentValue > 1) {
            setTempQuantity((currentValue - 1).toString());
        }
    };

    const handleConfirm = async () => {
        const newQuantity = parseInt(tempQuantity, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            updateItem({
                ...(isCurrent ? { quantity: newQuantity } : {}),
                name: tempName,
                category: selectedCategory,
            });
        }
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
                <View style={modalStyles.itemContainer}>
                    <Text style={modalStyles.label}>数量</Text>
                    <View style={modalStyles.quantityInputContainer}>
                        <TouchableOpacity
                            style={modalStyles.quantityAdjustButton}
                            onPress={decrementQuantity}
                        >
                            <Text style={modalStyles.quantityAdjustButtonText}>
                                -
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            ref={inputRef}
                            style={[
                                modalStyles.textInput,
                                {
                                    width: 100,
                                    marginHorizontal: 10,
                                    textAlign: 'center',
                                },
                            ]}
                            onChangeText={handleQuantityChange}
                            value={tempQuantity}
                            keyboardType={
                                Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                            }
                            textAlign="center"
                            returnKeyType="done"
                            onFocus={focusTextInputToEnd}
                            selectTextOnFocus={true}
                        />
                        <TouchableOpacity
                            style={modalStyles.quantityAdjustButton}
                            onPress={incrementQuantity}
                        >
                            <Text style={modalStyles.quantityAdjustButtonText}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <ModalPickerSelect
                label="カテゴリ"
                value={selectedCategory}
                items={CATEGORY_SELECT_ITEMS}
                onValueChange={setSelectedCategory}
            />
            <ModalHorizontalButtons
                onCancel={onClose}
                onSubmit={handleConfirm}
            />
        </Modal>
    );
}
