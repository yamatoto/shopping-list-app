import React from 'react';
import { Modal as RNModal, TouchableOpacity, View } from 'react-native';

import { modalStyles } from '@/shared/components/Modal/modalStyles';

const Modal: React.FC<{
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ visible, onClose, children }) => {
    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={modalStyles.modalOverlay}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View style={modalStyles.modalView}>{children}</View>
            </TouchableOpacity>
        </RNModal>
    );
};

export default Modal;
