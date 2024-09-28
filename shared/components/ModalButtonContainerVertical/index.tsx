import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { modalStyles } from '@/shared/styles/modalStyles';

type Props = {
    onSubmit1: () => void;
    submitText1: string;
    onSubmit2: () => void;
    submitText2: string;
    onCancel: () => void;
};
export default function ModalButtonContainerVertical({
    onCancel,
    onSubmit1,
    onSubmit2,
    submitText1,
    submitText2,
}: Props) {
    return (
        <View style={modalStyles.buttonContainerVertical}>
            <TouchableOpacity
                style={[
                    modalStyles.buttonInVertical,
                    modalStyles.confirmButton,
                ]}
                onPress={onSubmit1}
            >
                <Text style={modalStyles.buttonText}>{submitText1}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    modalStyles.buttonInVertical,
                    modalStyles.confirmButton,
                ]}
                onPress={onSubmit2}
            >
                <Text style={modalStyles.buttonText}>{submitText2}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[modalStyles.buttonInVertical, modalStyles.cancelButton]}
                onPress={onCancel}
            >
                <Text style={modalStyles.buttonText}>キャンセル</Text>
            </TouchableOpacity>
        </View>
    );
}
