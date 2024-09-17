import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { itemAddFormStyles } from '@/features/shopping-list/views/components/ItemAddForm/styles';

type Props = {
    screen: '直近' | '定番';
    tempNewItemName: string;
    setTempNewItemName: (text: string) => void;
    onAdd: (tempNewItemName: string, screen: '直近' | '定番') => void;
};
export default function ItemAddForm({
    tempNewItemName,
    setTempNewItemName,
    onAdd,
    screen,
}: Props) {
    return (
        <View style={itemAddFormStyles.inputContainer}>
            <TextInput
                style={itemAddFormStyles.input}
                value={tempNewItemName}
                onChangeText={setTempNewItemName}
                placeholderTextColor="#888"
                placeholder={`新しい${screen}の買い物を追加`}
            />
            <TouchableOpacity
                style={sharedStyles.addButton}
                onPress={() => onAdd(tempNewItemName, screen)}
            >
                <Text style={sharedStyles.addButtonText}>追加</Text>
            </TouchableOpacity>
        </View>
    );
}
