import React, { useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';

import { modalStyles } from '@/shared/styles/modalStyles';

type Props = {
    tempQuantity: string;
    setTempQuantity: (value: string) => void;
};
export default function QuantityInput({
    tempQuantity,
    setTempQuantity,
}: Props) {
    const inputRef = useRef<TextInput>(null);

    const focusTextInputToEnd = useCallback(() => {
        if (inputRef.current) {
            setTimeout(() => {
                (inputRef.current as TextInput).setSelection(
                    tempQuantity.length,
                    tempQuantity.length,
                );
            }, 50);
        }
    }, [tempQuantity]);

    const handleQuantityChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setTempQuantity(numericValue || '1'); // 空の場合は '1' にする
    };

    const incrementQuantity = () => {
        const currentValue = parseInt(tempQuantity, 10);
        setTempQuantity((currentValue + 1).toString());
    };

    const decrementQuantity = () => {
        const currentValue = parseInt(tempQuantity, 10);
        if (currentValue > 1) {
            setTempQuantity((currentValue - 1).toString());
        }
    };

    return (
        <View style={modalStyles.itemContainer}>
            <Text style={modalStyles.label}>数量</Text>
            <View style={modalStyles.quantityInputContainer}>
                <TouchableOpacity
                    style={modalStyles.quantityAdjustButton}
                    onPress={decrementQuantity}
                >
                    <Text style={modalStyles.quantityAdjustButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                    ref={inputRef}
                    style={[
                        modalStyles.textInput,
                        {
                            width: 100,
                            marginHorizontal: 10,
                            textAlign: 'center',
                        },
                    ]}
                    onChangeText={handleQuantityChange}
                    value={tempQuantity}
                    keyboardType={
                        Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    textAlign="center"
                    returnKeyType="done"
                    onFocus={focusTextInputToEnd}
                    selectTextOnFocus={true}
                />
                <TouchableOpacity
                    style={modalStyles.quantityAdjustButton}
                    onPress={incrementQuantity}
                >
                    <Text style={modalStyles.quantityAdjustButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
