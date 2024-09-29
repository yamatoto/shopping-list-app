import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommonSwipeListView from '../../../../../shared/components/CommonSwipeListView';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { DisplayItem } from '@/shared/models/itemModel';
import { useArchiveQuery } from '@/features/configure/archive/queries/useArchiveQuery';
import { useArchiveUsecase } from '@/features/configure/archive/usecases/useArchiveUsecase';
import ArchiveItemContainer from '@/features/configure/archive/views/components/ArchiveItemContainer';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import ShoppingPlatformButtons from '@/features/shopping-list/views/components/ShoppingPlatformButtons';

export default function Archive() {
    const { archiveItems, refreshing, selectedShoppingPlatformId } =
        useArchiveQuery();
    const {
        initialize,
        handleRefresh,
        handleDeleteItem,
        handleRestoreItem,
        handleShoppingPlatformSelect,
    } = useArchiveUsecase();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <ArchiveItemContainer
                    item={item}
                    restoreItem={isCurrent =>
                        handleRestoreItem(item, isCurrent)
                    }
                />
            );
        },
        [handleRestoreItem],
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
                <ShoppingPlatformButtons
                    selectedShoppingPlatformId={selectedShoppingPlatformId}
                    onSelect={handleShoppingPlatformSelect}
                />
                <CommonSwipeListView
                    data={archiveItems}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    refreshing={refreshing}
                    handleRefresh={handleRefresh}
                />
            </View>
        </GestureHandlerRootView>
    );
}
