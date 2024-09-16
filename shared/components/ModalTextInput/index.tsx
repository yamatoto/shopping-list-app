import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { modalStyles } from '@/shared/styles/modalStyles';

type Props = {
    label: string;
    value: string;
    style?: StyleProp<TextStyle>;
    onChangeText: (text: string) => void;
    placeholder?: string;
    editable?: boolean;
    placeholderTextColor?: string;
};
export default function ModalTextInput({
    label,
    value,
    onChangeText,
    placeholder,
    editable,
    placeholderTextColor,
}: Props) {
    return (
        <View style={modalStyles.itemContainer}>
            <Text style={modalStyles.label}>{label}</Text>
            <TextInput
                style={modalStyles.textInput}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                editable={editable}
                placeholderTextColor={placeholderTextColor}
            />
        </View>
    );
}
