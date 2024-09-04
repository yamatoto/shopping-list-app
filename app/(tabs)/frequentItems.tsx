import React, { useCallback, useEffect, useState } from 'react';
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
        // reorderFrequentItems,
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

    const renderItem = useCallback(
        ({ item }: { item: FrequentItem }) => {
            return (
                <View style={sharedStyles.itemContainer}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Text style={sharedStyles.itemNameText}>
                            {item.name}
                        </Text>
                    </View>
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
                        <Text
                            style={sharedStyles.buttonText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.isAddedToCurrent
                                ? '直近に追加済'
                                : '直近に追加'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        },
        [addToCurrentFromFrequent],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: FrequentItem }) => (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => deleteFrequentItem(item)}
                >
                    <Text style={sharedStyles.backTextWhite}>削除</Text>
                </TouchableOpacity>
            </View>
        ),
        [deleteFrequentItem],
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
                        placeholder="新しい定番の買い物を追加"
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
                    data={frequentItems}
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
