import { useCallback, useEffect } from 'react';

import { useToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { useArchiveItemStore } from '@/features/configure/archive/store/useArchiveStore';
import { DisplayItem } from '@/shared/models/itemModel';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import { ItemsRepository } from '@/shared/api/itemsRepository';
import { ShoppingPlatformId } from '@/shared/constants/shoppingPlatform';

export const useArchiveUsecase = () => {
    const { showToast } = useToast();
    const itemsRepository = new ItemsRepository();

    const {
        setResultOfFetchArchiveItems,
        setRefreshing,
        setSelectedShoppingPlatformId,
        selectedShoppingPlatformId,
    } = useArchiveItemStore();
    const { currentUser } = useFirebaseAuth();

    const fetchArchiveItems = useCallback(async () => {
        try {
            const items = await itemsRepository.fetchArchiveItems();
            setResultOfFetchArchiveItems(items);
        } catch (error: any) {
            console.error(error);
            showToast('アーカイブ買い物リストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchArchiveItems();
        setRefreshing(false);
    }, [fetchArchiveItems]);

    const initialize = useCallback(async () => {
        await fetchArchiveItems();
    }, []);

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem) => {
            try {
                await itemsRepository.delete(id);
            } catch (error: any) {
                console.error(error);
                showToast(
                    `アーカイブ買い物リストから「${name}」の削除に失敗しました。`,
                );
                return;
            }

            await fetchArchiveItems();
        },
        [currentUser, fetchArchiveItems, selectedShoppingPlatformId],
    );

    const handleRestoreItem = useCallback(
        async (item: DisplayItem, isCurrent: boolean) => {
            const updatedUser = currentUser!.displayName;
            const screenLabel = isCurrent ? SCREEN.CURRENT : SCREEN.FREQUENT;
            try {
                await itemsRepository.update(
                    {
                        ...item,
                        isCurrent,
                        isFrequent: !isCurrent,
                        updatedUser,
                    },
                    `${selectedShoppingPlatformId}の${screenLabel}の買い物リストに「${item.name}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${selectedShoppingPlatformId}の${screenLabel}の買い物リストへの追加に失敗しました。`,
                );
            }

            await fetchArchiveItems();
        },
        [currentUser, fetchArchiveItems, selectedShoppingPlatformId],
    );

    useEffect(() => {
        const unsubscribe = itemsRepository.setupUpdateListener(
            ({ message, updatedUser }) => {
                if (message) {
                    showToast(`${updatedUser}${message}`);
                }

                fetchArchiveItems().then();
            },
        );
        return () => {
            unsubscribe();
        };
    }, [fetchArchiveItems]);

    const handleShoppingPlatformSelect = (
        shoppingPlatformId: ShoppingPlatformId,
    ) => {
        setSelectedShoppingPlatformId(shoppingPlatformId);
    };

    return {
        initialize,
        handleRefresh,
        handleDeleteItem,
        handleRestoreItem,
        handleShoppingPlatformSelect,
    };
};
