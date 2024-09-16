import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { modalStyles } from '@/shared/styles/sharedStyles';

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
            <View style={modalStyles.modalOverlay}>
                <View style={modalStyles.modalView}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.label}>{item.name}</Text>
                    </View>
                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                modalStyles.button,
                                modalStyles.confirmButton,
                            ]}
                            onPress={() => handleConfirm(true)}
                        >
                            <Text style={modalStyles.buttonText}>
                                直近に追加
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                modalStyles.button,
                                modalStyles.confirmButton,
                            ]}
                            onPress={() => handleConfirm(false)}
                        >
                            <Text style={modalStyles.buttonText}>
                                定番に追加
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                modalStyles.button,
                                modalStyles.cancelButton,
                            ]}
                            onPress={onClose}
                        >
                            <Text style={modalStyles.buttonText}>
                                キャンセル
                            </Text>
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
});
