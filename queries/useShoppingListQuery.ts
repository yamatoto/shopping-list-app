import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useShoppingItemsStore } from '@/store/useShoppingItemsStore';
import { ApiResponseItem, DisplayItem } from '@/models/itemModel';

export const useShoppingListQuery = () => {
    const { resultOfFetchAllItems, refreshing } = useShoppingItemsStore(
        ({ resultOfFetchAllItems, refreshing }) => ({
            resultOfFetchAllItems,
            refreshing,
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

    return {
        currentItems,
        frequentItems,
        refreshing,
    };
};
