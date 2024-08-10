import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { useShoppingList } from '@/context/ShoppingListContext';
import { FrequentItem } from '@/models/item';
import { sharedStyles } from '@/styles/sharedStyles';

export default function FrequentShoppingListScreen() {
    const { frequentItems, addFrequentItem, addToCurrentFromFrequent } =
        useShoppingList();
    const [newItem, setNewItem] = React.useState('');

    const handleAddItem = () => {
        if (newItem.trim()) {
            addFrequentItem(newItem.trim());
            setNewItem('');
        }
    };

    const renderItem = ({ item }: { item: FrequentItem }) => (
        <View style={sharedStyles.item}>
            <Text>{item.text}</Text>
            <TouchableOpacity
                onPress={() => addToCurrentFromFrequent(item.id)}
                disabled={item.isAdded}
                style={[
                    sharedStyles.addButton,
                    item.isAdded && sharedStyles.addedButton,
                ]}
            >
                <Text style={sharedStyles.addButtonText}>
                    {item.isAdded ? '追加済み' : '買い物リストに追加'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.title}>定番アイテムリスト</Text>
            <View style={sharedStyles.inputContainer}>
                <TextInput
                    style={sharedStyles.input}
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="新しい定番アイテムを追加"
                />
                <TouchableOpacity
                    style={sharedStyles.addButton}
                    onPress={handleAddItem}
                >
                    <Text style={sharedStyles.addButtonText}>追加</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={frequentItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}
