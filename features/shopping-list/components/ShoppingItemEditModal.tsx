import React, { useCallback, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { DisplayItem } from '@/features/shopping-list/models/itemModel';

type Props = {
    item: DisplayItem;
    updateItem: (updatedItem: Partial<DisplayItem>) => void;
    visible: boolean;
    onClose: () => void;
    isCurrent: boolean;
};
const categories = [
    '未設定',
    '野菜',
    '肉・魚',
    '豆類',
    '乳製品',
    '調味料',
    '加工食品',
    '冷凍品',
    '飲料',
    'キッチン用品',
    '日用品',
    'その他',
].map(text => ({
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
        item.category || categories[0].value,
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.nameInput}
                        onChangeText={handleNameChange}
                        value={tempName}
                        placeholder="アイテム名を入力"
                    />
                    {isCurrent && (
                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                style={styles.adjustButton}
                                onPress={decrementQuantity}
                            >
                                <Text style={styles.adjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                ref={inputRef}
                                style={styles.modalInput}
                                onChangeText={handleQuantityChange}
                                value={tempQuantity}
                                keyboardType={
                                    Platform.OS === 'ios'
                                        ? 'number-pad'
                                        : 'numeric'
                                }
                                textAlign="center"
                                returnKeyType="done"
                                onFocus={focusTextInputToEnd}
                                selectTextOnFocus={true}
                            />
                            <TouchableOpacity
                                style={styles.adjustButton}
                                onPress={incrementQuantity}
                            >
                                <Text style={styles.adjustButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.label}>カテゴリ</Text>
                        <RNPickerSelect
                            placeholder={{}}
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                            items={categories}
                            style={pickerSelectStyles}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>キャンセル</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.buttonText}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    categoryContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    nameInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        fontSize: 18,
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    adjustButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adjustButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: 80,
        fontSize: 18,
        marginHorizontal: 10,
        textAlign: 'center',
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 20,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#789',
        borderRadius: 4,
        color: '#000',
    },
    inputAndroid: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
    },
});
