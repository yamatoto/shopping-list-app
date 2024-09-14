import { useCallback, useEffect } from 'react';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import * as ItemsRepository from '@/features/shopping-list/api/itemsRepository';
import * as ItemSortRepository from '@/features/shopping-list/api/itemSortRepository';
import {
    ApiResponseItem,
    DisplayItem,
} from '@/features/shopping-list/models/itemModel';
import { setupItemListener } from '@/features/shopping-list/api/itemsRepository';
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

    const checkRegisteredItem = useCallback(async (newItemName: string) => {
        try {
            const registeredItem =
                await ItemsRepository.findItemByName(newItemName);
            if (!!registeredItem) {
                showToast(`${newItemName}はすでに登録されています。`);
                return true;
            }
            return false;
        } catch (error: any) {
            console.error(error);
            showToast('商品の登録状況の確認に失敗しました。');
            return true;
        }
    }, []);

    const handleAddItem = useCallback(
        async (
            newItemName: string,
            isCurrent: boolean,
            // sortList: { id: string; list: string[] },
        ) => {
            const trimmedItemName = newItemName.trim();
            if (!trimmedItemName) return;
            const createdUser = currentUser!.displayName;
            try {
                const cannotRegister =
                    await checkRegisteredItem(trimmedItemName);
                if (cannotRegister) return;

                await ItemsRepository.addItem(
                    {
                        name: trimmedItemName,
                        quantity: 1,
                        isCurrent,
                        isFrequent: !isCurrent,
                        createdUser,
                        updatedUser: createdUser,
                    },
                    `${isCurrent ? '直近' : '定番'}の買い物リストに「${trimmedItemName}」を追加しました。`,
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

    const trimItem = useCallback((item: Partial<DisplayItem>) => {
        return Object.keys(item).reduce((acc, key) => {
            const value = item[key as keyof DisplayItem];
            if (typeof value === 'string') {
                acc[key as keyof DisplayItem] = value.trim() as any;
                return acc;
            }

            acc[key as keyof DisplayItem] = value as any;
            return acc;
        }, {} as Partial<DisplayItem>);
    }, []);

    const getChangedContent = useCallback(
        (beforeItem: DisplayItem, updateItem: Partial<DisplayItem>) => {
            return (Object.keys(updateItem) as Array<keyof DisplayItem>)
                .filter(key => updateItem[key] !== beforeItem[key])
                .map(
                    key =>
                        `${keyLabels[key]}: ${beforeItem[key]} → ${updateItem[key]}`,
                )
                .join('\n');
        },
        [],
    );

    const keyLabels: Partial<Record<keyof DisplayItem, string>> = {
        name: '商品名',
        quantity: '数量',
        category: 'カテゴリー',
    };
    const handleUpdateItem = useCallback(
        async (
            beforeItem: DisplayItem,
            updateItem: Partial<DisplayItem>,
            screen: '直近' | '定番',
        ) => {
            const trimmedUpdateItem = trimItem(updateItem);
            const { name: trimmedUpdateName } = trimmedUpdateItem;
            const changedContent = getChangedContent(
                beforeItem,
                trimmedUpdateItem,
            );
            if (!changedContent) return;

            const updatedUser = currentUser!.displayName;
            try {
                if (
                    trimmedUpdateName &&
                    trimmedUpdateName !== beforeItem.name
                ) {
                    const cannotRegister =
                        await checkRegisteredItem(trimmedUpdateName);
                    if (cannotRegister) return;
                }

                await ItemsRepository.updateItem(
                    {
                        ...beforeItem,
                        ...updateItem,
                        updatedUser,
                    },
                    `${screen}の買い物リストの「${beforeItem.name}」を更新しました。\n${changedContent}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`${screen}の買い物リストの更新に失敗しました。`);
            }
            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem, isCurrent: boolean) => {
            const updatedUser = currentUser!.displayName;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...(isCurrent
                            ? { isCurrent: false }
                            : { isFrequent: false }),
                        id,
                        updatedUser,
                    },
                    `${isCurrent ? '直近' : '定番'}の買い物リストから「${name}」を削除しました。`,
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
            const updatedUser = currentUser!.displayName;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...item,
                        isFrequent: true,
                        updatedUser,
                    },
                    `定番の買い物リストに「${item.name}」を追加しました。`,
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
            const updatedUser = currentUser!.displayName;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...item,
                        isCurrent: true,
                        updatedUser,
                    },
                    `直近の買い物リストに「${item.name}」を追加しました。`,
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
            const { message, updatedUser } =
                change.doc.data() as ApiResponseItem;

            if (message) {
                showToast(`${updatedUser}が${message}`);
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
