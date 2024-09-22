import React, { useRef } from 'react';
import {
    Keyboard,
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputContentSizeChangeEventData,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
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
    onContentSizeChange?: (
        e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => void;
    placeholderTextColor?: string;
};
export default function ModalTextArea({
    label,
    value,
    onChangeText,
    placeholder,
    editable,
    style,
    onContentSizeChange,
    placeholderTextColor,
}: Props) {
    const inputRef = useRef<TextInput>(null);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        inputRef.current?.blur();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={modalStyles.itemContainer}>
                <Text style={modalStyles.label}>{label}</Text>
                <TextInput
                    ref={inputRef}
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
        </TouchableWithoutFeedback>
    );
}
