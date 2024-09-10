import { useCallback, useEffect } from 'react';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import * as ItemsRepository from '@/shared/api/itemsRepository';
import * as ItemSortRepository from '@/shared/api/itemSortRepository';
import {
    ApiResponseItem,
    DisplayItem,
} from '@/features/shopping-list/models/itemModel';
import { setupItemListener } from '@/shared/api/itemsRepository';
import { showToast } from '@/shared/helpers/toast';

export const useShoppingListUsecase = () => {
    const {
        setResultOfFetchAllItems,
        setRefreshing,
        setResultOfFetchItemSortList,
    } = useShoppingItemsStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllItems = useCallback(async () => {
        try {
            const [items, sortList] = await Promise.all([
                ItemsRepository.fetchAllItems(),
                ItemSortRepository.fetchItemSortList(),
            ]);
            setResultOfFetchAllItems(items);
            setResultOfFetchItemSortList(sortList);
        } catch (error: any) {
            console.error(error);
            showToast('買い物リストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllItems();
        setRefreshing(false);
    }, [fetchAllItems]);

    const handleAddItem = useCallback(
        async (
            newItemName: string,
            isCurrent: boolean,
            // sortList: { id: string; list: string[] },
        ) => {
            const trimmedItem = newItemName.trim();
            if (!trimmedItem) return;
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.addItem(
                    {
                        name: trimmedItem,
                        quantity: 1,
                        isCurrent,
                        isFrequent: !isCurrent,
                        createdUser: userEmail,
                        updatedUser: userEmail,
                    },
                    `${isCurrent ? '直近' : '定番'}の買い物リストに「${trimmedItem}」が追加されました。`,
                );
                // await ItemSortRepository.updateItemSort(
                //     sortList.id,
                //     userEmail,
                //     [trimmedItem, ...sortList.list],
                // );
            } catch (error: any) {
                console.error(error);
                showToast('買い物リストの追加に失敗しました。');
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleUpdateItem = useCallback(
        async (updateItem: DisplayItem) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...updateItem,
                        updatedUser: userEmail,
                    },
                    `直近の買い物リストの「${updateItem}」が更新されました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast('買い物リストの更新に失敗しました。');
            }
            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem, isCurrent: boolean) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...(isCurrent
                            ? { isCurrent: false }
                            : { isFrequent: false }),
                        id,
                        updatedUser: userEmail,
                    },
                    `${isCurrent ? '直近' : '定番'}の買い物リストから「${name}」が削除されました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast('買い物リストの削除に失敗しました。');
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleAddToFrequent = useCallback(
        async (item: DisplayItem) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...item,
                        isFrequent: true,
                        updatedUser: userEmail,
                    },
                    `定番の買い物リストに「${item.name}」が追加されました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast('定番の買い物リストへの追加に失敗しました。');
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleAddToCurrent = useCallback(
        async (item: DisplayItem) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...item,
                        isCurrent: true,
                        updatedUser: userEmail,
                    },
                    `直近の買い物リストに「${item.name}」が追加されました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast('直近の買い物リストへの追加に失敗しました。');
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const initialize = useCallback(async () => {
        await fetchAllItems();
    }, []);

    useEffect(() => {
        const unsubscribe = setupItemListener(change => {
            const { message } = change.doc.data() as ApiResponseItem;

            if (message) {
                showToast(message);
            }

            fetchAllItems().then();
        });
        return () => unsubscribe();
    }, [fetchAllItems]);

    return {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToFrequent,
        handleAddToCurrent,
    };
};
