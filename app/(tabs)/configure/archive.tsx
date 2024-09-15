import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { DisplayItem } from '@/shared/models/itemModel';
import { useArchiveQuery } from '@/features/configure/archive/queries/useArchiveQuery';
import { useArchiveUsecase } from '@/features/configure/archive/usecases/useArchiveUsecase';
import ArchiveItemContainer from '@/features/configure/archive/components/ArchiveItemContainer';

export default function ArchiveScreen() {
    const { archiveItems, refreshing } = useArchiveQuery();
    const { initialize, handleRefresh, handleDeleteItem, handleRestoreItem } =
        useArchiveUsecase();

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
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => handleDeleteItem(item)}
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
                <SwipeListView
                    contentContainerStyle={{ backgroundColor: '#f0f0f0' }}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{ height: 1, backgroundColor: '#f0f0f0' }}
                        />
                    )}
                    closeOnRowOpen={true}
                    rightOpenValue={-75}
                    data={archiveItems}
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
