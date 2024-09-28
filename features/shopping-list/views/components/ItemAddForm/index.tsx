import { TextInput, View } from 'react-native';
import React, { useRef } from 'react';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { itemAddFormStyles } from '@/features/shopping-list/views/components/ItemAddForm/styles';
import { ScreenLabel } from '@/features/shopping-list/constants/screen';
import ButtonAdd from '@/shared/components/ButtonAdd';

type Props = {
    screenLabel: ScreenLabel;
    tempNewItemName: string;
    setTempNewItemName: (text: string) => void;
    onAdd: (tempNewItemName: string, screenLabel: ScreenLabel) => void;
};
export default function ItemAddForm({
    tempNewItemName,
    setTempNewItemName,
    onAdd,
    screenLabel,
}: Props) {
    const inputRef = useRef<TextInput>(null);

    const handleAdd = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
        onAdd(tempNewItemName, screenLabel);
    };

    return (
        <View style={itemAddFormStyles.inputContainer}>
            <TextInput
                ref={inputRef}
                style={itemAddFormStyles.input}
                value={tempNewItemName}
                onChangeText={setTempNewItemName}
                placeholderTextColor="#888"
                placeholder={`新しい${screenLabel}の買い物を追加`}
            />
            <ButtonAdd style={sharedStyles.addButton} onPress={handleAdd} />
        </View>
    );
}
