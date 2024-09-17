import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { CATEGORIES } from '@/features/shopping-list/constants/category';

export const useShoppingListQuery = () => {
    const { resultOfFetchAllItems, refreshing, openSections, tempNewItemName } =
        useShoppingItemsStore(
            ({
                resultOfFetchAllItems,
                refreshing,
                openSections,
                tempNewItemName,
            }) => ({
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
                const category = item.category || '未設定';
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
        return CATEGORIES.map(category => ({
            title: category,
            data: groupedItems[category] || [],
        })).filter(section => section.data.length > 0);
    }, [groupedItems]);

    return {
        currentItems,
        refreshing,
        frequentItemSections,
        openSections,
        tempNewItemName,
    };
};
