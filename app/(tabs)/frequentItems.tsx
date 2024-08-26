import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ScrollView,
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
        fetchAllFrequentItems,
        addFrequentItem,
        addToCurrentFromFrequent,
        deleteFrequentItem,
        reorderFrequentItems,
    } = useShoppingList();
    const [newItem, setNewItem] = React.useState('');
    const [refreshing, setRefreshing] = useState(false);

    const loadItems = useCallback(async () => {
        console.log('FrequentShoppingListScreen useEffect');
        await fetchAllFrequentItems();
        // fetchAllFrequentItemsをdepsに含めると無限レンダリングする
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadItems().then();
    }, [loadItems]);

    const handleAddItem = async () => {
        console.log('FrequentShoppingListScreen handleAddItem');
        const trimmedItem = newItem.trim();
        if (!trimmedItem) return;
        try {
            await addFrequentItem(trimmedItem);
            setNewItem('');
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    }, [loadItems]);

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
                <View style={sharedStyles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => addToCurrentFromFrequent(item)}
                        disabled={item.isAddedToCurrent}
                        style={[
                            sharedStyles.button,
                            item.isAddedToCurrent
                                ? sharedStyles.addedButton
                                : sharedStyles.addButton,
                        ]}
                    >
                        <Text style={sharedStyles.buttonText}>
                            {item.isAddedToCurrent
                                ? '直近に追加済'
                                : '直近に追加'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => deleteFrequentItem(item)}
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
                        placeholder="新しい定番の買い物を追加"
                    />
                    <TouchableOpacity
                        style={sharedStyles.addButton}
                        onPress={handleAddItem}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#5cb85c']} // Android
                            tintColor="#5cb85c" // iOS
                        />
                    }
                >
                    <DraggableFlatList
                        data={frequentItems}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        onDragEnd={({ data }) => reorderFrequentItems(data)}
                        scrollEnabled={false} // ScrollViewがスクロールを処理するため
                    />
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
}
