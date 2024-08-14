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
import { FrequentItem } from '@/models/item';
import { sharedStyles } from '@/styles/sharedStyles';

export default function FrequentShoppingListScreen() {
    console.log('FrequentShoppingListScreen');
    const {
        frequentItems,
        fetchFrequentItems,
        addFrequentItem,
        addToCurrentFromFrequent,
        deleteFrequentItem,
        reorderFrequentItems,
    } = useShoppingList();
    const [newItem, setNewItem] = React.useState('');

    useEffect(() => {
        console.log('FrequentShoppingListScreen useEffect');
        fetchFrequentItems().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddItem = async () => {
        console.log('FrequentShoppingListScreen handleAddItem');
        const trimmedItem = newItem.trim();
        if (!trimmedItem) return;
        const result = await addFrequentItem(trimmedItem);

        if (result) {
            Alert.alert('追加エラー', result);
            return;
        }

        setNewItem('');
    };

    const renderItem = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<FrequentItem>) => {
        console.log('FrequentShoppingListScreen renderItem');
        return (
            <TouchableOpacity
                style={[
                    sharedStyles.itemContainer,
                    isActive && sharedStyles.activeItem,
                ]}
                onLongPress={drag}
            >
                <Text>{item.name}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => addToCurrentFromFrequent(item.id)}
                        disabled={item.isAdded}
                        style={[
                            styles.button,
                            item.isAdded
                                ? styles.addedButton
                                : styles.addButton,
                        ]}
                    >
                        <Text style={styles.buttonText}>
                            {item.isAdded ? '追加済み' : '追加'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteFrequentItem(item.id)}
                        style={[styles.button, styles.deleteButton]}
                    >
                        <Text style={styles.buttonText}>削除</Text>
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
                        placeholder="新しい定番アイテムを追加"
                    />
                    <TouchableOpacity
                        style={sharedStyles.addButton}
                        onPress={handleAddItem}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>
                <DraggableFlatList
                    data={frequentItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    onDragEnd={({ data }) => reorderFrequentItems(data)}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        padding: 5,
        marginLeft: 5,
        borderRadius: 3,
    },
    addButton: {
        backgroundColor: '#5cb85c',
    },
    addedButton: {
        backgroundColor: '#cccccc',
    },
    deleteButton: {
        backgroundColor: '#ff6b6b',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
});
