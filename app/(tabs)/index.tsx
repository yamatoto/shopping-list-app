import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
    RenderItemParams,
} from 'react-native-draggable-flatlist';

import { useShoppingList } from '@/context/ShoppingListContext';
import { Item } from '@/models/item';
import { sharedStyles } from '@/styles/sharedStyles';

export default function CurrentShoppingListScreen() {
    const {
        currentItems,
        addCurrentItem,
        toggleCurrentItem,
        deleteCurrentItem,
        reorderCurrentItems,
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

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => (
        <TouchableOpacity
            style={[
                sharedStyles.itemContainer,
                isActive && sharedStyles.activeItem,
            ]}
            onLongPress={drag}
        >
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
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                <DraggableFlatList
                    data={currentItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    onDragEnd={({ data }) => reorderCurrentItems(data)}
                />
            </View>
        </GestureHandlerRootView>
    );
}
