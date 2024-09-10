import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useShoppingItemsStore } from '@/features/shopping-list/store/useShoppingItemsStore';
import {
    ApiResponseItem,
    DisplayItem,
} from '@/features/shopping-list/models/itemModel';

export const useShoppingListQuery = () => {
    const { resultOfFetchAllItems, refreshing } = useShoppingItemsStore(
        ({ resultOfFetchAllItems, refreshing }) => ({
            resultOfFetchAllItems,
            refreshing,
        }),
    );
    // const { resultOfFetchItemSortList, resultOfFetchAllItems, refreshing } =
    //     useShoppingItemsStore(
    //         ({
    //             resultOfFetchItemSortList,
    //             resultOfFetchAllItems,
    //             refreshing,
    //         }) => ({
    //             resultOfFetchItemSortList,
    //             resultOfFetchAllItems,
    //             refreshing,
    //         }),
    //     );

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

    // const { currentItems, frequentItems } = useMemo(() => {
    //     if (
    //         resultOfFetchItemSortList.length === 0 ||
    //         resultOfFetchAllItems.length === 0
    //     ) {
    //         return { currentItems: [], frequentItems: [] };
    //     }
    //     const { currentItems, frequentItems } = resultOfFetchAllItems.reduce<{
    //         currentItems: DisplayItem[];
    //         frequentItems: DisplayItem[];
    //     }>(
    //         (acc, fetchedItem) => {
    //             const converted = convertToClientItemFromServer(fetchedItem);
    //             return {
    //                 currentItems: converted.isCurrent
    //                     ? [...acc.currentItems, converted]
    //                     : acc.currentItems,
    //                 frequentItems: converted.isFrequent
    //                     ? [...acc.frequentItems, converted]
    //                     : acc.frequentItems,
    //             };
    //         },
    //         { currentItems: [], frequentItems: [] },
    //     );
    //     console.log(resultOfFetchItemSortList);
    //     const currentItemList = resultOfFetchItemSortList
    //         .find(s => s.data().itemType === 'current')!
    //         .data().itemList;
    //     const frequentItemList = resultOfFetchItemSortList
    //         .find(s => s.data().itemType === 'frequent')!
    //         .data().itemList;
    //     return {
    //         currentItems: currentItemList.map(
    //             name => currentItems.find(c => c.name === name)!,
    //         ),
    //         frequentItems: frequentItemList.map(
    //             name => frequentItems.find(c => c.name === name)!,
    //         ),
    //     };
    // }, [resultOfFetchItemSortList, resultOfFetchAllItems]);

    return {
        currentItems,
        frequentItems,
        refreshing,
    };
};
