import React from 'react';
import {
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputContentSizeChangeEventData,
    View,
} from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { modalStyles } from '@/shared/styles/modalStyles';

const ModalTextArea: React.FC<{
    label: string;
    value: string;
    style?: StyleProp<TextStyle>;
    onChangeText: (text: string) => void;
    placeholder?: string;
    editable?: boolean;
    onContentSizeChange?: (
        e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => void;
    placeholderTextColor?: string;
}> = ({
    label,
    value,
    onChangeText,
    placeholder,
    editable,
    style,
    onContentSizeChange,
    placeholderTextColor,
}) => {
    return (
        <View style={modalStyles.itemContainer}>
            <Text style={modalStyles.label}>{label}</Text>
            <TextInput
                style={[modalStyles.areaInput, style]}
                multiline
                numberOfLines={4}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder ?? ''}
                placeholderTextColor={placeholderTextColor || '#888'}
                editable={editable}
                onContentSizeChange={onContentSizeChange}
            />
        </View>
    );
};

export default ModalTextArea;
