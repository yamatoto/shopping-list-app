import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommonSwipeListView from '@/shared/components/CommonSwipeListView';
import { useCurrentShoppingListQuery } from '@/features/shopping-list/queries/useCurrentShoppingListQuery';
import { useCurrentShoppingListUsecase } from '@/features/shopping-list/usecases/useCurrentShoppingListUsecase';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import ItemAddForm from '@/features/shopping-list/views/components/ItemAddForm';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import ShoppingPlatformButtons from '@/features/shopping-list/views/components/ShoppingPlatformButtons';
import ShoppingItemEditModal from '@/features/shopping-list/views/components/ShoppingItemEditModal';
import Loading from '@/shared/components/Loading';

export default function CurrentShoppingList() {
    const {
        currentItems,
        refreshing,
        tempNewItemName,
        categorySelectItems,
        shoppingPlatformDetailSelectItems,
        selectedShoppingPlatformId,
        modalVisibleItem,
    } = useCurrentShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToFrequent,
        setTempNewItemName,
        handleShoppingPlatformSelect,
        handleShowItemModal,
        handleCloseItemModal,
    } = useCurrentShoppingListUsecase();

    useEffect(() => {
        initialize();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <ShoppingItemContainer
                    screenLabel={SCREEN.CURRENT}
                    item={item}
                    onAddToAnother={handleAddToFrequent}
                    onPress={() => handleShowItemModal(item)}
                />
            );
        },
        [handleUpdateItem, handleAddToFrequent, categorySelectItems],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: DisplayItem }) => (
            <HiddenDeleteButton onPress={() => handleDeleteItem(item)} />
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
                    selectedShoppingPlatformId={selectedShoppingPlatformId}
                    onSelect={handleShoppingPlatformSelect}
                />

                {currentItems.length === 0 ? (
                    <Loading />
                ) : (
                    <CommonSwipeListView
                        data={currentItems}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        refreshing={refreshing}
                        handleRefresh={handleRefresh}
                    />
                )}
                {modalVisibleItem && (
                    <ShoppingItemEditModal
                        screenLabel={SCREEN.CURRENT}
                        onConfirm={values =>
                            handleUpdateItem(modalVisibleItem, values)
                        }
                        item={modalVisibleItem}
                        categorySelectItems={categorySelectItems}
                        shoppingPlatformDetailSelectItems={
                            shoppingPlatformDetailSelectItems
                        }
                        onClose={() => handleCloseItemModal()}
                    />
                )}
            </View>
        </GestureHandlerRootView>
    );
}
