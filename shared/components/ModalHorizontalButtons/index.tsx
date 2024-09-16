import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { modalStyles } from '@/shared/styles/modalStyles';

const ModalHorizontalButtons: React.FC<{
    onCancel: () => void;
    onSubmit: () => void;
    submitText?: string;
}> = ({ onCancel, onSubmit, submitText = '送信' }) => {
    return (
        <View style={modalStyles.buttonContainerHorizontal}>
            <TouchableOpacity
                style={[
                    modalStyles.buttonInHorizontal,
                    modalStyles.cancelButton,
                ]}
                onPress={onCancel}
            >
                <Text style={modalStyles.buttonText}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    modalStyles.buttonInHorizontal,
                    modalStyles.confirmButton,
                ]}
                onPress={onSubmit}
            >
                <Text style={modalStyles.buttonText}>{submitText}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ModalHorizontalButtons;
