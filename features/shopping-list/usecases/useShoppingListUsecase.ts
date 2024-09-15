import { useCallback, useEffect } from 'react';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import * as ItemsRepository from '@/shared/api/itemsRepository';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { setupItemListener } from '@/shared/api/itemsRepository';
import { showToast } from '@/shared/helpers/toast';

export const useShoppingListUsecase = () => {
    const { setResultOfFetchAllItems, setRefreshing } = useShoppingItemsStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllItems = useCallback(async () => {
        try {
            const items = await ItemsRepository.fetchAllItems();
            setResultOfFetchAllItems(items);
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

    const checkRegisteredItem = useCallback(
        async (newItemName: string, screen: '直近' | '定番') => {
            const fetchedItem =
                await ItemsRepository.findItemByName(newItemName);
            if (!fetchedItem) {
                return { isDuplicated: false, registeredItem: null };
            }
            const { id, isCurrent, isFrequent } = fetchedItem.data();
            if (screen === '直近') {
                return {
                    isDuplicated: isCurrent,
                    registeredItem: { id, isCurrent, isFrequent },
                };
            }

            return {
                isDuplicated: isFrequent,
                registeredItem: { id, isCurrent, isFrequent },
            };
        },
        [],
    );

    const handleAddItem = useCallback(
        async (newItemName: string, screen: '直近' | '定番') => {
            const trimmedItemName = newItemName.trim();
            if (!trimmedItemName) return;
            const createdUser = currentUser!.displayName;
            try {
                const { isDuplicated, registeredItem } =
                    await checkRegisteredItem(newItemName, screen);
                if (isDuplicated) {
                    showToast(`${newItemName}はすでに登録されています。`);
                    return;
                }

                if (registeredItem) {
                    await ItemsRepository.updateItem(
                        {
                            id: registeredItem.id,
                            name: trimmedItemName,
                            isCurrent:
                                screen === '直近' || registeredItem.isCurrent,
                            isFrequent:
                                screen === '定番' || registeredItem.isFrequent,
                            updatedUser: createdUser,
                        },
                        `${screen}の買い物リストに「${newItemName}」を追加しました。`,
                    );
                    return;
                }

                await ItemsRepository.addItem(
                    {
                        name: trimmedItemName,
                        quantity: 1,
                        isCurrent: screen === '直近',
                        isFrequent: screen === '定番',
                        category: '未設定',
                        createdUser,
                        updatedUser: createdUser,
                    },
                    `${screen}の買い物リストに「${trimmedItemName}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`${screen}の買い物リストの追加に失敗しました。`);
                return;
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
                    const { isDuplicated } = await checkRegisteredItem(
                        trimmedUpdateName,
                        screen,
                    );
                    if (isDuplicated) {
                        showToast(
                            `${trimmedUpdateName}はすでに登録されています。`,
                        );
                        return;
                    }
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
                return;
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
                return;
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
                return;
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
                return;
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
