import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { Keyboard, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';

import { sharedStyles } from '@/shared/styles/sharedStyles';

type Props = {
    onPress: () => void;
    style?: StyleProp<TextStyle>;
    disabled?: boolean;
};
export default function ButtonAdd({ style, onPress }: Props) {
    const inputRef = useRef<TextInput>(null);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        inputRef.current?.blur();
    };

    return (
        <TouchableOpacity
            style={[style, sharedStyles.addButton]}
            onPress={() => {
                dismissKeyboard();
                onPress();
            }}
        >
            <Text style={sharedStyles.addButtonText}>追加</Text>
        </TouchableOpacity>
    );
}
