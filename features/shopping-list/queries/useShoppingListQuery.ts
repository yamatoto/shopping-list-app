import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { SHOPPING_PLATFORM } from '@/shared/constants/shoppingPlatform';

export const useShoppingListQuery = () => {
    const {
        resultOfFetchCategorySort,
        resultOfFetchAllItems,
        refreshing,
        openSections,
        tempNewItemName,
        selectedShoppingPlatform,
        resultOfFetchAllRakutenItems,
        resultOfFetchAllAmazonItems,
    } = useShoppingItemsStore(
        ({
            resultOfFetchCategorySort,
            resultOfFetchAllItems,
            refreshing,
            openSections,
            tempNewItemName,
            selectedShoppingPlatform,
            resultOfFetchAllRakutenItems,
            resultOfFetchAllAmazonItems,
        }) => ({
            resultOfFetchCategorySort,
            resultOfFetchAllItems,
            refreshing,
            openSections,
            tempNewItemName,
            selectedShoppingPlatform,
            resultOfFetchAllRakutenItems,
            resultOfFetchAllAmazonItems,
        }),
    );

    const convertToClientItemFromServer = (
        fetchedItem: QueryDocumentSnapshot<ApiResponseItem>,
    ): DisplayItem => {
        const data = fetchedItem.data();
        return {
            ...data,
            id: fetchedItem.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const { currentItems, frequentItems } = useMemo(() => {
        const allItems = {
            [SHOPPING_PLATFORM.SUPER]: resultOfFetchAllItems,
            [SHOPPING_PLATFORM.RAKUTEN]: resultOfFetchAllRakutenItems,
            [SHOPPING_PLATFORM.AMAZON]: resultOfFetchAllAmazonItems,
        }[selectedShoppingPlatform];
        return allItems.reduce<{
            currentItems: DisplayItem[];
            frequentItems: DisplayItem[];
        }>(
            (acc, fetchedItem) => {
                const converted = convertToClientItemFromServer(fetchedItem);
                return {
                    currentItems: converted.isCurrent
                        ? [...acc.currentItems, converted]
                        : acc.currentItems,
                    frequentItems: converted.isFrequent
                        ? [...acc.frequentItems, converted]
                        : acc.frequentItems,
                };
            },
            { currentItems: [], frequentItems: [] },
        );
    }, [
        selectedShoppingPlatform,
        resultOfFetchAllItems,
        resultOfFetchAllRakutenItems,
        resultOfFetchAllAmazonItems,
    ]);

    const groupedItems = useMemo(() => {
        return frequentItems.reduce(
            (acc, item) => {
                const categoryId = item.categoryId;
                if (!acc[categoryId]) {
                    acc[categoryId] = [];
                }
                acc[categoryId].push(item);
                return acc;
            },
            {} as { [key: string]: DisplayItem[] },
        );
    }, [frequentItems]);

    const frequentItemSections = useMemo(() => {
        return resultOfFetchCategorySort
            ?.data()
            .categories.map(({ id, name }) => ({
                title: name,
                id,
                data: groupedItems[id] || [],
            }))
            .filter(section => section.data.length > 0);
    }, [groupedItems, resultOfFetchCategorySort]);

    const categorySelectItems = useMemo(() => {
        return (
            resultOfFetchCategorySort?.data().categories.map(category => ({
                label: category.name,
                value: category.id,
            })) ?? []
        );
    }, [resultOfFetchCategorySort]);

    const formattedOpenSections = useMemo(() => {
        return (
            resultOfFetchCategorySort?.data().categories.reduce(
                (acc, { id }) => {
                    acc[id] = openSections.includes(id);
                    return acc;
                },
                {} as { [key: string]: boolean },
            ) ?? {}
        );
    }, [resultOfFetchCategorySort, openSections]);

    return {
        currentItems,
        refreshing,
        frequentItemSections,
        openSections: formattedOpenSections,
        tempNewItemName,
        categorySelectItems,
        selectedShoppingPlatform,
    };
};
