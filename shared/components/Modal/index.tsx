import React from 'react';
import {
    Modal as RNModal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import { modalStyles } from '@/shared/components/Modal/styles';

type Props = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
};
export default function Modal({ visible, onClose, children }: Props) {
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
                {/* モーダル内部のタッチでモーダル閉じないように */}
                <TouchableWithoutFeedback>
                    <View style={modalStyles.modalView}>{children}</View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </RNModal>
    );
}
