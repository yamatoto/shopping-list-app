import { TextInput, View } from 'react-native';
import React, { useRef } from 'react';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { addFormStyles } from '@/shared/components/AddForm/styles';
import ButtonAdd from '@/shared/components/ButtonAdd';

type Props = {
    tempNewItemName: string;
    setTempNewItemName: (text: string) => void;
    onAdd: () => void;
    placeholder: string;
};
export default function AddForm({
    tempNewItemName,
    setTempNewItemName,
    onAdd,
    placeholder,
}: Props) {
    const inputRef = useRef<TextInput>(null);

    const handleAdd = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
        onAdd();
    };

    return (
        <View style={addFormStyles.inputContainer}>
            <TextInput
                ref={inputRef}
                style={addFormStyles.input}
                value={tempNewItemName}
                onChangeText={setTempNewItemName}
                placeholderTextColor="#888"
                placeholder={placeholder}
            />
            <ButtonAdd style={sharedStyles.addButton} onPress={handleAdd} />
        </View>
    );
}
