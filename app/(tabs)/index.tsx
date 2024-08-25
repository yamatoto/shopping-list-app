import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
        fetchAllCurrentItems,
        addCurrentItem,
        addToFrequentFromCurrent,
        deleteCurrentItem,
        reorderCurrentItems,
    } = useShoppingList();
    const [newItem, setNewItem] = React.useState('');

    useEffect(() => {
        console.log('CurrentShoppingListScreen useEffect');
        fetchAllCurrentItems().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddItem = async () => {
        const trimmedItem = newItem.trim();
        console.log('CurrentShoppingListScreen handleAddItem', trimmedItem);
        if (!trimmedItem) return;
        try {
            await addCurrentItem(trimmedItem);
            setNewItem('');
        } catch (error: any) {
            Alert.alert(error.message);
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
                <Text>{item.name}</Text>
                <View style={sharedStyles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => addToFrequentFromCurrent(item)}
                        disabled={item.isAddedToFrequent}
                        style={[
                            sharedStyles.button,
                            item.isAddedToFrequent
                                ? sharedStyles.addedButton
                                : sharedStyles.addButton,
                        ]}
                    >
                        <Text style={sharedStyles.buttonText}>
                            {item.isAddedToFrequent
                                ? '定番に追加済'
                                : '定番に追加'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteCurrentItem(item)}
                        style={[sharedStyles.button, sharedStyles.deleteButton]}
                    >
                        <Text style={sharedStyles.buttonText}>削除</Text>
                    </TouchableOpacity>
                </View>
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
                        placeholderTextColor="#888"
                        placeholder="新しい直近の買い物を追加"
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
