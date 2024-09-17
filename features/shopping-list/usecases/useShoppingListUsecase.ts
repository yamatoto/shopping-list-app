import { useCallback, useEffect } from 'react';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import * as ItemsRepository from '@/shared/api/itemsRepository';
import { DisplayItem } from '@/shared/models/itemModel';
import { setupItemListener } from '@/shared/api/itemsRepository';
import { showToast } from '@/shared/helpers/toast';
import { SCREEN, ScreenLabel } from '@/features/shopping-list/constants/screen';

export const useShoppingListUsecase = () => {
    const {
        setResultOfFetchAllItems,
        setRefreshing,
        setOpenSections,
        setTempNewItemName,
    } = useShoppingItemsStore();
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
        async (newItemName: string, screenLabel: ScreenLabel) => {
            const fetchedItem =
                await ItemsRepository.findItemByName(newItemName);
            if (!fetchedItem) {
                return { isDuplicated: false, registeredItem: null };
            }
            const { id, isCurrent, isFrequent } = fetchedItem.data();
            if (screenLabel === SCREEN.CURRENT) {
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
        async (newItemName: string, screenLabel: ScreenLabel) => {
            const isCurrentScreen = screenLabel === SCREEN.CURRENT;
            const trimmedItemName = newItemName.trim();
            if (!trimmedItemName) return;
            const createdUser = currentUser!.displayName;
            try {
                const { isDuplicated, registeredItem } =
                    await checkRegisteredItem(newItemName, screenLabel);
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
                                isCurrentScreen || registeredItem.isCurrent,
                            isFrequent:
                                !isCurrentScreen || registeredItem.isFrequent,
                            updatedUser: createdUser,
                        },
                        `${screen}の買い物リストに「${newItemName}」を追加しました。`,
                    );
                    setTempNewItemName('');
                    return;
                }

                await ItemsRepository.addItem(
                    {
                        name: trimmedItemName,
                        quantity: 1,
                        isCurrent: isCurrentScreen,
                        isFrequent: !isCurrentScreen,
                        category: '未設定',
                        createdUser,
                        updatedUser: createdUser,
                    },
                    `${screenLabel}の買い物リストに「${trimmedItemName}」を追加しました。`,
                );
                setTempNewItemName('');
            } catch (error: any) {
                console.error(error);
                showToast(`${screenLabel}の買い物リストの追加に失敗しました。`);
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
            screenLabel: ScreenLabel,
        ) => {
            const trimmedUpdateItem = trimItem(updateItem);
            const { name: trimmedUpdateName } = trimmedUpdateItem;
            const changedContent = getChangedContent(
                beforeItem,
                trimmedUpdateItem,
            );
            if (!changedContent) return;

            try {
                if (
                    trimmedUpdateName &&
                    trimmedUpdateName !== beforeItem.name
                ) {
                    const { isDuplicated } = await checkRegisteredItem(
                        trimmedUpdateName,
                        screenLabel,
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
                        updatedUser: currentUser!.displayName,
                    },
                    `${screenLabel}の買い物リストの「${beforeItem.name}」を更新しました。\n${changedContent}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`${screenLabel}の買い物リストの更新に失敗しました。`);
                return;
            }
            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem, screenLabel: ScreenLabel) => {
            const updatedUser = currentUser!.displayName;
            try {
                await ItemsRepository.updateItem(
                    {
                        ...(screenLabel === SCREEN.CURRENT
                            ? { isCurrent: false }
                            : { isFrequent: false }),
                        id,
                        updatedUser,
                    },
                    `${screenLabel}の買い物リストから「${name}」を削除しました。`,
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
                    `${SCREEN.FREQUENT}の買い物リストに「${item.name}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SCREEN.FREQUENT}の買い物リストへの追加に失敗しました。`,
                );
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
                    `${SCREEN.CURRENT}の買い物リストに「${item.name}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SCREEN.CURRENT}の買い物リストへの追加に失敗しました。`,
                );
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
        const unsubscribe = setupItemListener(({ message, updatedUser }) => {
            if (message) {
                showToast(`${updatedUser}${message}`);
            }

            fetchAllItems().then();
        });
        return () => unsubscribe();
    }, [fetchAllItems]);

    const toggleSection = (category: string) => {
        setOpenSections(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    return {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToFrequent,
        handleAddToCurrent,
        toggleSection,
        setTempNewItemName,
    };
};
