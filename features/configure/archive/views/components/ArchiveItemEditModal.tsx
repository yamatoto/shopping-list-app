import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { modalStyles } from '@/shared/styles/modalStyles';
import Modal from '@/shared/components/Modal';

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
        <Modal visible={visible} onClose={onClose}>
            <View style={styles.nameContainer}>
                <Text style={styles.label}>{item.name}</Text>
            </View>
            <View style={modalStyles.buttonContainer}>
                <TouchableOpacity
                    style={[modalStyles.button, modalStyles.confirmButton]}
                    onPress={() => handleConfirm(true)}
                >
                    <Text style={modalStyles.buttonText}>直近に追加</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[modalStyles.button, modalStyles.confirmButton]}
                    onPress={() => handleConfirm(false)}
                >
                    <Text style={modalStyles.buttonText}>定番に追加</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[modalStyles.button, modalStyles.cancelButton]}
                    onPress={onClose}
                >
                    <Text style={modalStyles.buttonText}>キャンセル</Text>
                </TouchableOpacity>
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
});
