import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';

type Props = {
    item: DisplayItem;
    restoreItem: (isCurrent: boolean) => void;
    visible: boolean;
    onClose: () => void;
};

export default function ArchiveItemEditModal({
    item,
    restoreItem,
    visible,
    onClose,
}: Props) {
    const handleConfirm = async (isCurrent: boolean) => {
        restoreItem(isCurrent);
        onClose();
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
                    <View style={styles.nameContainer}>
                        <Text style={styles.label}>{item.name}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => handleConfirm(true)}
                        >
                            <Text style={styles.buttonText}>直近に追加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => handleConfirm(false)}
                        >
                            <Text style={styles.buttonText}>定番に追加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>キャンセル</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    nameContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
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
        flexDirection: 'column',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
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
