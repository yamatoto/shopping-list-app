import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';

import { useShoppingList } from '@/context/ShoppingListContext';
import { Item } from '@/models/item';
import { sharedStyles } from '@/styles/sharedStyles';

export default function CurrentShoppingListScreen() {
    const {
        currentItems,
        addCurrentItem,
        toggleCurrentItem,
        deleteCurrentItem,
    } = useShoppingList();
    const [newItem, setNewItem] = React.useState('');

    const handleAddItem = () => {
        const trimmedItem = newItem.trim();
        if (!trimmedItem) return;
        const result = addCurrentItem(trimmedItem);

        if (result) {
            Alert.alert('追加エラー', result);
            return;
        }

        if (newItem.trim()) {
            addCurrentItem(newItem.trim());
            setNewItem('');
        }
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={sharedStyles.item}>
            <TouchableOpacity onPress={() => toggleCurrentItem(item.id)}>
                <Text
                    style={
                        item.completed ? sharedStyles.completedItem : undefined
                    }
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCurrentItem(item.id)}>
                <Text style={sharedStyles.deleteButton}>削除</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={sharedStyles.container}>
            <Text style={sharedStyles.title}>直近の買い物リスト</Text>
            <View style={sharedStyles.inputContainer}>
                <TextInput
                    style={sharedStyles.input}
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="新しいアイテムを追加"
                />
                <TouchableOpacity
                    style={sharedStyles.addButton}
                    onPress={handleAddItem}
                >
                    <Text style={sharedStyles.addButtonText}>追加</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={currentItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}
