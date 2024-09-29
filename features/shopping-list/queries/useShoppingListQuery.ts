import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';

export const useShoppingListQuery = () => {
    const {
        resultOfFetchCategorySort,
        resultOfFetchAllItems,
        refreshing,
        openSections,
        tempNewItemName,
        selectedShoppingPlatformId,
    } = useShoppingItemsStore(
        ({
            resultOfFetchCategorySort,
            resultOfFetchAllItems,
            refreshing,
            openSections,
            tempNewItemName,
            selectedShoppingPlatformId,
        }) => ({
            resultOfFetchCategorySort,
            resultOfFetchAllItems,
            refreshing,
            openSections,
            tempNewItemName,
            selectedShoppingPlatformId,
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
        return resultOfFetchAllItems
            .filter(
                item =>
                    item.data().shoppingPlatformId ===
                    selectedShoppingPlatformId,
            )
            .reduce<{
                currentItems: DisplayItem[];
                frequentItems: DisplayItem[];
            }>(
                (acc, fetchedItem) => {
                    const converted =
                        convertToClientItemFromServer(fetchedItem);
                    return {
                        ...acc,
                        currentItems: converted.isCurrent
                            ? [...acc.currentItems, converted]
                            : acc.currentItems,
                        frequentItems: converted.isFrequent
                            ? [...acc.frequentItems, converted]
                            : acc.frequentItems,
                    };
                },
                {
                    currentItems: [],
                    frequentItems: [],
                },
            );
    }, [selectedShoppingPlatformId, resultOfFetchAllItems]);

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
    }, [groupedItems]);

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
        frequentItemSections,
        refreshing,
        openSections: formattedOpenSections,
        tempNewItemName,
        categorySelectItems,
        selectedShoppingPlatformId,
    };
};
