import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { DisplayItem } from '@/shared/models/itemModel';
import { useArchiveQuery } from '@/features/configure/archive/queries/useArchiveQuery';
import { useArchiveUsecase } from '@/features/configure/archive/usecases/useArchiveUsecase';
import ArchiveItemContainer from '@/features/configure/archive/views/components/ArchiveItemContainer';
import CommonSwipeListView from '@/features/shopping-list/views/components/CommonSwipeListView';

export default function Archive() {
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
                <CommonSwipeListView
                    data={archiveItems}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe
                    closeOnRowOpen={true}
                    refreshing={refreshing}
                    handleRefresh={handleRefresh}
                    ItemSeparatorComponent={() => (
                        <View
                            style={{ height: 1, backgroundColor: '#f0f0f0' }}
                        />
                    )}
                />
            </View>
        </GestureHandlerRootView>
    );
}
