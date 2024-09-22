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
    } = useShoppingItemsStore(
        ({
            resultOfFetchCategorySort,
            resultOfFetchAllItems,
            refreshing,
            openSections,
            tempNewItemName,
        }) => ({
            resultOfFetchCategorySort,
            resultOfFetchAllItems,
            refreshing,
            openSections,
            tempNewItemName,
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

    const { currentItems, frequentItems } = useMemo(
        () =>
            resultOfFetchAllItems.reduce<{
                currentItems: DisplayItem[];
                frequentItems: DisplayItem[];
            }>(
                (acc, fetchedItem) => {
                    const converted =
                        convertToClientItemFromServer(fetchedItem);
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
            ),
        [resultOfFetchAllItems],
    );

    const groupedItems = useMemo(() => {
        return frequentItems.reduce(
            (acc, item) => {
                const category = item.category;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(item);
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
    };
};
