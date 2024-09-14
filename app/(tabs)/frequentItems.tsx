import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { DisplayItem } from '@/features/shopping-list/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/components/ShoppingItemContainer';

export default function FrequentShoppingListScreen() {
    const { frequentItems, refreshing } = useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToCurrent,
    } = useShoppingListUsecase();
    const [newItemName, setNewItemName] = useState('');

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <ShoppingItemContainer
                    item={item}
                    updateItem={newItem =>
                        handleUpdateItem(item, newItem, '定番')
                    }
                    onAddToAnother={() => handleAddToCurrent(item)}
                    isCurrentScreen={false}
                />
            );
        },
        [handleUpdateItem, handleAddToCurrent],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: DisplayItem }) => (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => handleDeleteItem(item, false)}
                >
                    <Text style={sharedStyles.backTextWhite}>削除</Text>
                </TouchableOpacity>
            </View>
        ),
        [handleDeleteItem],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={sharedStyles.inputContainer}>
                    <TextInput
                        style={sharedStyles.input}
                        value={newItemName}
                        onChangeText={setNewItemName}
                        placeholderTextColor="#888"
                        placeholder="新しい定番の買い物を追加"
                    />
                    <TouchableOpacity
                        style={sharedStyles.addButton}
                        onPress={() => {
                            setNewItemName('');
                            handleAddItem(newItemName, false).then();
                        }}
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
                            onRefresh={handleRefresh}
                            colors={['#5cb85c']}
                            tintColor="#5cb85c"
                        />
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
}
