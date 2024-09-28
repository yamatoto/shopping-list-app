import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type Props = {
    title: string;
    onPress: () => void;
    style?: StyleProp<TextStyle>;
    disabled?: boolean;
};
export default function ButtonSubmit({
    title,
    onPress,
    style,
    disabled,
}: Props) {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled, style]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text
                style={[
                    styles.buttonText,
                    disabled && styles.buttonTextDisabled,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonTextDisabled: {
        color: '#ccc',
    },
});
