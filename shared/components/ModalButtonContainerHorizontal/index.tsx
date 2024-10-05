import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { modalStyles } from '@/shared/styles/modalStyles';

type Props = {
    onCancel: () => void;
    onSubmit: () => void;
    submitText?: string;
};
export default function ModalButtonContainerHorizontal({
    onCancel,
    onSubmit,
    submitText = '更新',
}: Props) {
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
}
