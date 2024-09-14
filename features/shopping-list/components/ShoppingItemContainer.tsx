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

import { DisplayItem } from '@/features/shopping-list/models/itemModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';

type QuantityControlProps = {
    item: DisplayItem;
    updateQuantity: (updatedItem: DisplayItem) => Promise<void>;
    onAddToFrequent: () => void;
};
export default function ShoppingItemContainer({
    item,
    updateQuantity,
    onAddToFrequent,
}: QuantityControlProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [tempQuantity, setTempQuantity] = useState(
        (item.quantity ?? 1).toString(),
    );
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
            await updateQuantity({ ...item, quantity: newQuantity });
        }
        setModalVisible(false);
    };

    return (
        <TouchableOpacity
            style={sharedStyles.itemContainer}
            onPress={() => setModalVisible(true)} // 行全体をクリックした際にモーダルを表示
            activeOpacity={1} // 行全体がタッチ可能であることを示す（透明度を変えない）
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.quantityText}>
                            {item.quantity ?? 1}
                        </Text>
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalView}>
                                <View style={styles.inputContainer}>
                                    <TouchableOpacity
                                        style={styles.adjustButton}
                                        onPress={decrementQuantity}
                                    >
                                        <Text style={styles.adjustButtonText}>
                                            -
                                        </Text>
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
                                        <Text style={styles.adjustButtonText}>
                                            +
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.cancelButton,
                                        ]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.buttonText}>
                                            キャンセル
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.confirmButton,
                                        ]}
                                        onPress={handleConfirm}
                                    >
                                        <Text style={styles.buttonText}>
                                            確定
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <Text style={sharedStyles.itemNameText}>{item.name}</Text>
            </View>
            <TouchableOpacity
                onPress={e => {
                    e.stopPropagation(); // 子コンポーネントのタッチイベントが親に伝播しないようにする
                    onAddToFrequent();
                }}
                disabled={item.isFrequent}
                style={[
                    sharedStyles.button,
                    item.isFrequent
                        ? sharedStyles.addedButton
                        : sharedStyles.addButton,
                ]}
            >
                <Text
                    style={sharedStyles.buttonText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.isFrequent ? '定番に追加済' : '定番に追加'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    quantityContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 5,
        minWidth: 30,
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
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
});
