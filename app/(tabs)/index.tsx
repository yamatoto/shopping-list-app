import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

import { useShoppingList } from '@/context/ShoppingListContext';
import { CurrentItem } from '@/models/item';
import { sharedStyles } from '@/styles/sharedStyles';
import QuantityControl from '@/components/QuantityControl';

export default function CurrentShoppingListScreen() {
    console.log('CurrentShoppingListScreen');
    const {
        currentItems,
        fetchAllCurrentItems,
        addCurrentItem,
        addToFrequentFromCurrent,
        deleteCurrentItem,
        // reorderCurrentItems,
        updateCurrentItem,
    } = useShoppingList();
    const [newItem, setNewItem] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const loadItems = useCallback(async () => {
        console.log('CurrentShoppingListScreen loadItems');
        await fetchAllCurrentItems();
        // fetchAllCurrentItemsをdepsに含めると無限レンダリングする
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadItems().then();
    }, [loadItems]);

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

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    }, [loadItems]);

    const renderItem = useCallback(
        ({ item }: { item: CurrentItem }) => {
            return (
                <View style={sharedStyles.itemContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <QuantityControl
                            item={item}
                            updateQuantity={updateCurrentItem}
                        />
                        <Text style={sharedStyles.itemNameText}>
                            {item.name}
                        </Text>
                    </View>
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
                        <Text
                            style={sharedStyles.buttonText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.isAddedToFrequent
                                ? '定番に追加済'
                                : '定番に追加'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        },
        [addToFrequentFromCurrent, updateCurrentItem],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: CurrentItem }) => (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => deleteCurrentItem(item)}
                >
                    <Text style={sharedStyles.backTextWhite}>削除</Text>
                </TouchableOpacity>
            </View>
        ),
        [deleteCurrentItem],
    );

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

                <SwipeListView
                    contentContainerStyle={{ backgroundColor: '#f0f0f0' }}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{ height: 1, backgroundColor: '#f0f0f0' }}
                        />
                    )}
                    closeOnRowOpen={true}
                    rightOpenValue={-75}
                    data={currentItems}
                    renderItem={renderItem}
                    renderHiddenItem={item => renderHiddenItem(item)}
                    disableRightSwipe
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#5cb85c']}
                            tintColor="#5cb85c"
                        />
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
}
