import React from 'react';
import { Text, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import { modalStyles } from '@/shared/styles/modalStyles';

type Props = {
    label: string;
    value: string;
    style?: StyleProp<TextStyle>;
};
export default function ModalTextView({ label, value, style }: Props) {
    return (
        <View style={modalStyles.itemContainer}>
            <Text style={modalStyles.label}>{label}</Text>
            <Text style={[modalStyles.textViewArea, style]}>{value}</Text>
        </View>
    );
}
