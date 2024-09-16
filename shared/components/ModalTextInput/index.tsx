import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { modalStyles } from '@/shared/styles/modalStyles';

const ModalTextInput: React.FC<{
    label: string;
    value: string;
    style?: StyleProp<TextStyle>;
    onChangeText: (text: string) => void;
    placeholder?: string;
    editable?: boolean;
    placeholderTextColor?: string;
}> = ({
    label,
    value,
    onChangeText,
    placeholder,
    editable,
    placeholderTextColor,
}) => {
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
};

export default ModalTextInput;
