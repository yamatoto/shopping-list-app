import React from 'react';
import { Text, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import RNPickerSelect, { Item } from 'react-native-picker-select';

import { modalStyles } from '@/shared/styles/modalStyles';
import { pickerSelectStyles } from '@/shared/styles/sharedStyles';

type Props<T> = {
    label: string;
    value: T;
    items: Item[];
    onValueChange: (value: T) => void;
    disabled?: boolean;
    style?: StyleProp<TextStyle>;
};
export default function ModalPickerSelect<T>({
    label,
    value,
    items,
    onValueChange,
    disabled,
    style,
}: Props<T>) {
    return (
        <View style={[modalStyles.itemContainer, style]}>
            <Text style={modalStyles.label}>{label}</Text>
            <RNPickerSelect
                placeholder={{}}
                value={value}
                onValueChange={onValueChange}
                items={items}
                style={pickerSelectStyles}
                doneText="選択"
                disabled={disabled}
                activeItemStyle={pickerSelectStyles.activeItemStyle}
            />
        </View>
    );
}
