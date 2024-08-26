import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Platform,
} from 'react-native';

import { CurrentItem } from '@/models/item';

type QuantityControlProps = {
    item: CurrentItem;
    updateQuantity: (updatedItem: CurrentItem) => Promise<void>;
};
export default function QuantityControl({
    item,
    updateQuantity,
}: QuantityControlProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [tempQuantity, setTempQuantity] = useState(
        (item.quantity ?? 1).toString(),
    );
    const inputRef = useRef<TextInput>(null);

    const handleQuantityUpdate = async () => {
        const newQuantity = parseInt(tempQuantity, 10);
        if (Number.isNaN(newQuantity) || newQuantity <= 0) {
            setTempQuantity((item.quantity ?? 1).toString());
            setModalVisible(false);
            return;
        }

        await updateQuantity({ ...item, quantity: Number(newQuantity) });
        setModalVisible(false);
    };

    const focusTextInputToEnd = () => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.setSelection(
                    tempQuantity.length,
                    tempQuantity.length,
                );
            }, 50);
        }
    };

    const handleQuantityChange = (text: string) => {
        // 数字のみを許可
        const numericValue = text.replace(/[^0-9]/g, '');
        setTempQuantity(numericValue);
    };

    return (
        <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.quantityText}>{item.quantity ?? 1}</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <TextInput
                            ref={inputRef}
                            style={styles.modalInput}
                            onChangeText={handleQuantityChange}
                            value={tempQuantity}
                            keyboardType={
                                Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                            }
                            textAlign="right"
                            returnKeyType="done"
                            onFocus={focusTextInputToEnd}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.changeButton]}
                                onPress={handleQuantityUpdate}
                            >
                                <Text style={styles.buttonText}>変更</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setTempQuantity(
                                        (item.quantity ?? 1).toString(),
                                    );
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    キャンセル
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
        padding: 35,
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
    modalInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 20,
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        minWidth: 100,
        alignItems: 'center',
    },
    changeButton: {
        backgroundColor: '#2196F3',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
