import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useFrequentShoppingItemsStore } from '@/features/shopping-list/store/useFrequentShoppingItemsStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import {
    SHOPPING_PLATFORM_DETAIL_LIST,
    SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP,
} from '@/shared/constants/shoppingPlatform';

export const useFrequentShoppingListQuery = () => {
    const {
        resultOfFetchCategorySort,
        resultOfFetchFrequentItems,
        refreshing,
        openSections,
        tempNewItemName,
        selectedShoppingPlatformId,
        modalVisibleItem,
    } = useFrequentShoppingItemsStore(
        ({
            resultOfFetchCategorySort,
            resultOfFetchFrequentItems,
            refreshing,
            openSections,
            tempNewItemName,
            selectedShoppingPlatformId,
            modalVisibleItem,
        }) => ({
            resultOfFetchCategorySort,
            resultOfFetchFrequentItems,
            refreshing,
            openSections,
            tempNewItemName,
            selectedShoppingPlatformId,
            modalVisibleItem,
        }),
    );

    const convertToClientItemFromServer = (
        fetchedItem: QueryDocumentSnapshot<ApiResponseItem>,
    ): DisplayItem => {
        const data = fetchedItem.data();
        return {
            ...data,
            id: fetchedItem.id,
            shoppingPlatformDetailLabel:
                data.shoppingPlatformDetailId === 'NotSet'
                    ? ''
                    : SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP[
                          data.shoppingPlatformDetailId
                      ],
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const frequentAllItems = useMemo(
        () =>
            resultOfFetchFrequentItems.map(fetchedItem =>
                convertToClientItemFromServer(fetchedItem),
            ),
        [resultOfFetchFrequentItems],
    );

    const frequentItems = useMemo(
        () =>
            frequentAllItems.filter(
                item => item.shoppingPlatformId === selectedShoppingPlatformId,
            ),
        [selectedShoppingPlatformId],
    );

    const frequentItemSections = useMemo(() => {
        const groupedItems = frequentItems.reduce(
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

        return resultOfFetchCategorySort
            ?.data()
            .categories.map(({ id, name }) => ({
                title: name,
                id,
                data: groupedItems[id] || [],
            }))
            .filter(section => section.data.length > 0);
    }, [resultOfFetchCategorySort, frequentItems]);

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
        frequentItemSections,
        refreshing,
        openSections: formattedOpenSections,
        tempNewItemName,
        categorySelectItems,
        shoppingPlatformDetailSelectItems: SHOPPING_PLATFORM_DETAIL_LIST.filter(
            ({ shoppingPlatformId }) =>
                shoppingPlatformId === selectedShoppingPlatformId ||
                shoppingPlatformId === 0,
        ).map(platform => ({
            value: platform.id,
            label: platform.label,
        })),
        selectedShoppingPlatformId,
        modalVisibleItem,
    };
};
