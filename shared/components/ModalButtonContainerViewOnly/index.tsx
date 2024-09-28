import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { modalStyles } from '@/shared/styles/modalStyles';

type Props = {
    onClose: () => void;
};
export default function ModalButtonContainerViewOnly({ onClose }: Props) {
    return (
        <View style={modalStyles.buttonContainerOnlyView}>
            <TouchableOpacity
                style={[modalStyles.confirmButton]}
                onPress={onClose}
            >
                <Text style={modalStyles.buttonText}>閉じる</Text>
            </TouchableOpacity>
        </View>
    );
}
