import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { hiddenDeleteButtonStyles } from '@/shared/components/HiddenDeleteButton/styles';

type Props = {
    onPress: () => void;
    buttonText?: string;
    isModalVisible?: boolean;
    modalContent?: React.ReactNode;
    buttonStyle?: object;
    textStyle?: object;
};

export default function HiddenDeleteButton({
    onPress,
    buttonText = '削除',
    isModalVisible,
    modalContent,
    buttonStyle,
    textStyle,
}: Props) {
    return (
        <View style={hiddenDeleteButtonStyles.rowBack}>
            <TouchableOpacity
                style={[hiddenDeleteButtonStyles.backRightBtn, buttonStyle]}
                onPress={onPress}
            >
                <Text
                    style={[hiddenDeleteButtonStyles.backTextWhite, textStyle]}
                >
                    {buttonText}
                </Text>
                {isModalVisible && modalContent}
            </TouchableOpacity>
        </View>
    );
}
