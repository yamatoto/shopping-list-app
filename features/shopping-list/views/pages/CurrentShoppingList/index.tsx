import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import CommonSwipeListView from '@/features/shopping-list/views/components/CommonSwipeListView';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import ItemAddForm from '@/features/shopping-list/views/components/ItemAddForm';

export default function CurrentShoppingList() {
    const { currentItems, refreshing, tempNewItemName } =
        useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToFrequent,
        setTempNewItemName,
    } = useShoppingListUsecase();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <ShoppingItemContainer
                    item={item}
                    updateItem={newItem =>
                        handleUpdateItem(item, newItem, '直近')
                    }
                    onAddToAnother={() => handleAddToFrequent(item)}
                    isCurrentScreen={true}
                />
            );
        },
        [handleUpdateItem, handleAddToFrequent],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: DisplayItem }) => (
            <HiddenDeleteButton onPress={() => handleDeleteItem(item, true)} />
        ),
        [handleDeleteItem],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <ItemAddForm
                    screen="直近"
                    tempNewItemName={tempNewItemName}
                    setTempNewItemName={setTempNewItemName}
                    onAdd={handleAddItem}
                />

                <CommonSwipeListView
                    data={currentItems}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    refreshing={refreshing}
                    handleRefresh={handleRefresh}
                />
            </View>
        </GestureHandlerRootView>
    );
}
