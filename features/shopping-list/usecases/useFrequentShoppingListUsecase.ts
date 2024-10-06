import { useCallback, useEffect } from 'react';

import { useFrequentShoppingItemsStore } from '@/features/shopping-list/store/useFrequentShoppingItemsStore';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { DisplayItem } from '@/shared/models/itemModel';
import { useToast } from '@/shared/helpers/toast';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import { InputValues } from '@/features/shopping-list/models/form';
import { CategorySortRepository } from '@/shared/api/categorySortRepository';
import { ItemsRepository } from '@/shared/api/itemsRepository';
import {
    SHOPPING_PLATFORM_TO_LABEL_MAP,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';
import { FrequentShoppingList } from '@/features/shopping-list/usecases/FrequentShoppingList';

export const useFrequentShoppingListUsecase = () => {
    const categorySortRepository = new CategorySortRepository();
    const itemsRepository = new ItemsRepository();
    const shoppingList = new FrequentShoppingList();

    const { showToast } = useToast();
    const { currentUser } = useFirebaseAuth();

    const {
        setResultOfFetchFrequentItems,
        setRefreshing,
        setOpenSections,
        setTempNewItemName,
        setResultOfFetchCategorySort,
        resultOfFetchCategorySort,
        setSelectedShoppingPlatformId,
        selectedShoppingPlatformId,
        setModalVisibleItem,
    } = useFrequentShoppingItemsStore();

    const fetchAllItems = useCallback(async () => {
        try {
            const [categorySortApi, frequentItems] = await Promise.all([
                categorySortRepository.fetchOne(),
                itemsRepository.findBy('isFrequent', true),
            ]);
            setResultOfFetchCategorySort(categorySortApi);
            setResultOfFetchFrequentItems(frequentItems);
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

    const handleAddItem = useCallback(
        async (newItemName: string) => {
            try {
                await shoppingList.addItem({
                    newItemName,
                    createdUser: currentUser!.displayName,
                    selectedShoppingPlatformId,
                });
                setTempNewItemName('');
                await fetchAllItems();
            } catch (error: any) {
                if (error?.message === '登録済') {
                    showToast(
                        `${selectedShoppingPlatformId}に${newItemName}はすでに登録されています。`,
                    );
                    return;
                }

                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.FREQUENT}の買い物リストの追加に失敗しました。`,
                );
                return;
            }
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const handleUpdateItem = useCallback(
        async (beforeItem: DisplayItem, values: InputValues) => {
            try {
                await shoppingList.updateItem({
                    beforeItem,
                    values,
                    updatedUser: currentUser!.displayName,
                    selectedShoppingPlatformId,
                    resultOfFetchCategorySort,
                });
            } catch (error: any) {
                if (error?.message === '登録済') {
                    showToast(
                        `${selectedShoppingPlatformId}に${values.name}はすでに登録されています。`,
                    );
                    return;
                }

                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.FREQUENT}の買い物リストの更新に失敗しました。`,
                );
                return;
            }
            await fetchAllItems();
        },
        [
            currentUser,
            fetchAllItems,
            selectedShoppingPlatformId,
            resultOfFetchCategorySort,
        ],
    );

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem) => {
            const updatedUser = currentUser!.displayName;
            try {
                await itemsRepository.update(
                    {
                        isFrequent: false,
                        id,
                        updatedUser,
                    },
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.FREQUENT}の買い物リストから「${name}」を削除しました。`,
                );
                await fetchAllItems();
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の買い物リストの削除に失敗しました。`,
                );
                return;
            }
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
                await fetchAllItems();
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${SHOPPING_PLATFORM_TO_LABEL_MAP[selectedShoppingPlatformId]}の${SCREEN.CURRENT}の買い物リストへの追加に失敗しました。`,
                );
                return;
            }
        },
        [currentUser, fetchAllItems, selectedShoppingPlatformId],
    );

    const initialize = () => {
        fetchAllItems().then(categorySortApi => {
            setOpenSections(
                categorySortApi?.data().categories.map(({ id }) => id) ?? [],
            );
        });
    };

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

    const handleShowItemModal = (item: DisplayItem | null) => {
        setModalVisibleItem(item);
    };

    const handleCloseItemModal = () => {
        setModalVisibleItem(null);
    };

    return {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToCurrent,
        toggleSection,
        setTempNewItemName,
        handleShoppingPlatformSelect,
        handleShowItemModal,
        handleCloseItemModal,
    };
};
