import { useCallback, useEffect } from 'react';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { DisplayItem } from '@/shared/models/itemModel';
import { useToast } from '@/shared/helpers/toast';
import { SCREEN, ScreenLabel } from '@/features/shopping-list/constants/screen';
import {
    FormattedInputValues,
    INPUT_KEY_LABELS,
    InputValues,
} from '@/features/shopping-list/models/form';
import { CategorySortRepository } from '@/shared/api/categorySortRepository';
import { DEFAULT_CATEGORY } from '@/shared/models/categorySortModel';
import { ItemsRepository } from '@/shared/api/itemsRepository';
import {
    SHOPPING_PLATFORM_DETAIL,
    SHOPPING_PLATFORM_TO_LABEL_MAP,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';

export const useShoppingListUsecase = () => {
    const categorySortRepository = new CategorySortRepository();
    const itemsRepository = new ItemsRepository();
    const { showToast } = useToast();
    const {
        setResultOfFetchAllItems,
        setRefreshing,
        setOpenSections,
        setTempNewItemName,
        setResultOfFetchCategorySort,
        resultOfFetchCategorySort,
        setSelectedShoppingPlatformId,
        selectedShoppingPlatformId,
    } = useShoppingItemsStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllItems = useCallback(async () => {
        try {
            const [categorySortApi, items] = await Promise.all([
                categorySortRepository.fetchOne(),
                itemsRepository.fetchAll(),
            ]);
            setResultOfFetchCategorySort(categorySortApi);
            setResultOfFetchAllItems(items);
            return categorySortApi;
        } catch (error: any) {
            console.error(error);
            showToast('買い物リストの取得に失敗しました。');
        }
    }, [currentUser]);

    const fetchCategorySortApi = useCallback(async () => {
        try {
            const categorySortApi = await categorySortRepository.fetchOne();
            setResultOfFetchCategorySort(categorySortApi);
        } catch (error: any) {
            console.error(error);
            showToast('カテゴリーリストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllItems();
        setRefreshing(false);
    }, [fetchAllItems]);

    const checkRegisteredItem = useCallback(
        async (newItemName: string, screenLabel: ScreenLabel) => {
            const fetchedItem = await itemsRepository.findByName(newItemName);
            if (!fetchedItem) {
                return { isDuplicated: false, registeredItem: null };
            }
            const id = fetchedItem.id;
            const { isCurrent, isFrequent } = fetchedItem.data();
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
        [selectedShoppingPlatformId],
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
                    showToast(
                        `${selectedShoppingPlatformId}に${newItemName}はすでに登録されています。`,
                    );
                    return;
                }

                if (registeredItem) {
                    await itemsRepository.update(
                        {
                            id: registeredItem.id,
                            name: trimmedItemName,
                            isCurrent:
                                isCurrentScreen || registeredItem.isCurrent,
                            isFrequent:
                                !isCurrentScreen || registeredItem.isFrequent,
                            updatedUser: createdUser,
                        },
                        `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${screenLabel}の買い物リストに「${newItemName}」を追加しました。`,
                    );
                    setTempNewItemName('');
                    return;
                }

                await itemsRepository.add(
                    {
                        name: trimmedItemName,
                        quantity: 1,
                        isCurrent: isCurrentScreen,
                        isFrequent: !isCurrentScreen,
                        categoryId: DEFAULT_CATEGORY.id,
                        shoppingPlatformId: selectedShoppingPlatformId,
                        shoppingPlatformDetailId:
                            SHOPPING_PLATFORM_DETAIL.NOT_SET.id,
                        createdUser,
                        updatedUser: createdUser,
                    },
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${screenLabel}の買い物リストに「${trimmedItemName}」を追加しました。`,
                );
                setTempNewItemName('');
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${screenLabel}の買い物リストの追加に失敗しました。`,
                );
                return;
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const trimItem = (item: InputValues) => {
        return Object.keys(item).reduce((acc, key) => {
            const value = item[key as keyof InputValues];
            acc[key as keyof InputValues] = value?.trim() as any;
            return acc;
        }, {} as InputValues);
    };

    const getChangedContent = useCallback(
        (beforeItem: DisplayItem, values: FormattedInputValues) => {
            return (Object.keys(values) as Array<keyof InputValues>)
                .filter(key => values[key] !== beforeItem[key])
                .map(key => {
                    if (key !== 'categoryId') {
                        return `${INPUT_KEY_LABELS[key]}: ${beforeItem[key]} → ${values[key]}`;
                    }

                    const categories =
                        resultOfFetchCategorySort?.data().categories;
                    const beforeCategoryName = categories?.find(
                        ({ id }) => id === beforeItem.categoryId,
                    )?.name;
                    const newCategoryName = categories?.find(
                        ({ id }) => id === values.categoryId,
                    )?.name;
                    return `${INPUT_KEY_LABELS[key]}: ${beforeCategoryName} → ${newCategoryName}`;
                })
                .join('\n');
        },
        [],
    );

    const formatInputValues = (
        beforeItem: DisplayItem,
        values: InputValues,
        screenLabel: ScreenLabel,
    ) => {
        const targetValues =
            screenLabel === SCREEN.FREQUENT
                ? (() => {
                      const { quantity: _, ...rest } = values;
                      return rest;
                  })()
                : values;
        const trimmedValues = trimItem(targetValues);
        const { quantity, ...rest } = trimmedValues;
        return {
            id: beforeItem.id,
            ...rest,
            ...(quantity ? { quantity: parseInt(quantity, 10) } : {}),
        };
    };

    const handleUpdateItem = useCallback(
        async (
            beforeItem: DisplayItem,
            values: InputValues,
            screenLabel: ScreenLabel,
        ) => {
            const formatedInputValues = formatInputValues(
                beforeItem,
                values,
                screenLabel,
            );
            const { name: trimmedUpdateName } = formatedInputValues;
            const changedContent = getChangedContent(
                beforeItem,
                formatedInputValues,
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
                            `${selectedShoppingPlatformId}に${trimmedUpdateName}はすでに登録されています。`,
                        );
                        return;
                    }
                }

                await itemsRepository.update(
                    {
                        ...beforeItem,
                        ...formatedInputValues,
                        updatedUser: currentUser!.displayName,
                    },
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${screenLabel}の買い物リストの「${beforeItem.name}」を更新しました。\n${changedContent}`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${screenLabel}の買い物リストの更新に失敗しました。`,
                );
                return;
            }
            await fetchAllItems();
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem, screenLabel: ScreenLabel) => {
            const updatedUser = currentUser!.displayName;
            try {
                await itemsRepository.update(
                    {
                        ...(screenLabel === SCREEN.CURRENT
                            ? { isCurrent: false }
                            : { isFrequent: false }),
                        id,
                        updatedUser,
                    },
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${screenLabel}の買い物リストから「${name}」を削除しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の買い物リストの削除に失敗しました。`,
                );
                return;
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const handleAddToFrequent = useCallback(
        async (item: DisplayItem) => {
            const updatedUser = currentUser!.displayName;
            try {
                await itemsRepository.update(
                    {
                        ...item,
                        isFrequent: true,
                        updatedUser,
                    },
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.FREQUENT}の買い物リストに「${item.name}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.FREQUENT}の買い物リストへの追加に失敗しました。`,
                );
                return;
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const handleAddToCurrent = useCallback(
        async (item: DisplayItem) => {
            const updatedUser = currentUser!.displayName;
            try {
                await itemsRepository.update(
                    {
                        ...item,
                        isCurrent: true,
                        updatedUser,
                    },
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.CURRENT}の買い物リストに「${item.name}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.CURRENT}の買い物リストへの追加に失敗しました。`,
                );
                return;
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const initialize = useCallback(async () => {
        const categorySortApi = await fetchAllItems();
        setOpenSections(
            categorySortApi?.data().categories.map(({ id }) => id) ?? [],
        );
    }, []);

    useEffect(() => {
        const unsubscribeCategories =
            categorySortRepository.setupUpdateListener(() => {
                fetchCategorySortApi().then();
            });

        const unsubscribeItems = itemsRepository.setupUpdateListener(
            ({ message, updatedUser }) => {
                showToast(`${updatedUser}${message}`);
                fetchAllItems().then();
            },
        );
        return () => {
            unsubscribeCategories();
            unsubscribeItems();
        };
    }, [fetchAllItems]);

    const toggleSection = (category: string) => {
        setOpenSections([category]);
    };

    const handleShoppingPlatformSelect = (
        shoppingPlatformId: ShoppingPlatformId,
    ) => {
        setSelectedShoppingPlatformId(shoppingPlatformId);
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
        handleShoppingPlatformSelect,
    };
};
