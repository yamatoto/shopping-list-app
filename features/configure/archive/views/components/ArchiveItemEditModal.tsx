import React from 'react';
import { View, Text } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { modalStyles } from '@/shared/styles/modalStyles';
import Modal from '@/shared/components/Modal';
import ModalVerticalButtons from '@/shared/components/ModalVerticalButtons';

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
            <View style={modalStyles.itemContainer}>
                <Text style={modalStyles.label}>{item.name}</Text>
            </View>
            <ModalVerticalButtons
                onSubmit1={() => handleConfirm(true)}
                submitText1="直近に追加"
                onSubmit2={() => handleConfirm(false)}
                submitText2="定番に追加"
                onCancel={onClose}
            />
        </Modal>
    );
}
