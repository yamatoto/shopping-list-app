import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommonSwipeListView from '../../../../../shared/components/CommonSwipeListView';

import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import ItemAddForm from '@/features/shopping-list/views/components/ItemAddForm';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import ShoppingPlatformButtons from '@/features/shopping-list/views/components/ShoppingPlatformButtons';

export default function CurrentShoppingList() {
    const {
        currentItems,
        refreshing,
        tempNewItemName,
        categorySelectItems,
        selectedShoppingPlatform,
    } = useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToFrequent,
        setTempNewItemName,
        handleShoppingPlatformSelect,
    } = useShoppingListUsecase();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <ShoppingItemContainer
                    screenLabel={SCREEN.CURRENT}
                    item={item}
                    categorySelectItems={categorySelectItems}
                    onConfirm={values =>
                        handleUpdateItem(item, values, SCREEN.CURRENT)
                    }
                    onAddToAnother={handleAddToFrequent}
                />
            );
        },
        [handleUpdateItem, handleAddToFrequent],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: DisplayItem }) => (
            <HiddenDeleteButton
                onPress={() => handleDeleteItem(item, SCREEN.CURRENT)}
            />
        ),
        [handleDeleteItem],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <ItemAddForm
                    screenLabel={SCREEN.CURRENT}
                    tempNewItemName={tempNewItemName}
                    setTempNewItemName={setTempNewItemName}
                    onAdd={handleAddItem}
                />

                <ShoppingPlatformButtons
                    selectedShoppingPlatform={selectedShoppingPlatform}
                    onSelect={handleShoppingPlatformSelect}
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
