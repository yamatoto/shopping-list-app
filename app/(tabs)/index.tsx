import React, { useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
    RenderItemParams,
} from 'react-native-draggable-flatlist';

import { useShoppingList } from '@/context/ShoppingListContext';
import { CurrentItem } from '@/models/item';
import { sharedStyles } from '@/styles/sharedStyles';

export default function CurrentShoppingListScreen() {
    console.log('CurrentShoppingListScreen');
    const {
        currentItems,
        fetchCurrentItems,
        addCurrentItem,
        toggleCurrentItem,
        deleteCurrentItem,
        reorderCurrentItems,
    } = useShoppingList();
    const [newItem, setNewItem] = React.useState('');

    useEffect(() => {
        console.log('CurrentShoppingListScreen useEffect');
        fetchCurrentItems().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddItem = async () => {
        const trimmedItem = newItem.trim();
        console.log('CurrentShoppingListScreen handleAddItem', trimmedItem);
        if (!trimmedItem) return;
        const result = await addCurrentItem(trimmedItem);
        setNewItem('');

        if (result) {
            Alert.alert('追加エラー', result);
            return;
        }
    };

    const renderItem = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<CurrentItem>) => {
        console.log('CurrentShoppingListScreen renderItem');
        return (
            <TouchableOpacity
                style={[
                    sharedStyles.itemContainer,
                    isActive && sharedStyles.activeItem,
                ]}
                onLongPress={drag}
            >
                <TouchableOpacity onPress={() => toggleCurrentItem(item)}>
                    <Text
                        style={
                            item.completed ? styles.completedItem : undefined
                        }
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCurrentItem(item.id)}>
                    <Text style={styles.deleteButton}>削除</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
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
const styles = StyleSheet.create({
    completedItem: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    deleteButton: {
        color: '#d9534f',
    },
});
