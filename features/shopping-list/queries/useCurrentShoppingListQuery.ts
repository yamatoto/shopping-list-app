import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useCurrentShoppingItemsStore } from '@/features/shopping-list/store/useCurrentShoppingItemsStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import {
    SHOPPING_PLATFORM_DETAIL_LIST,
    SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP,
} from '@/shared/constants/shoppingPlatform';

export const useCurrentShoppingListQuery = () => {
    const {
        resultOfFetchCategorySort,
        resultOfFetchCurrentItems,
        refreshing,
        tempNewItemName,
        selectedShoppingPlatformId,
        modalVisibleItem,
    } = useCurrentShoppingItemsStore(
        ({
            resultOfFetchCategorySort,
            resultOfFetchCurrentItems,
            refreshing,
            tempNewItemName,
            selectedShoppingPlatformId,
            modalVisibleItem,
        }) => ({
            resultOfFetchCategorySort,
            resultOfFetchCurrentItems,
            refreshing,
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

    const currentAllItems = useMemo(() => {
        return resultOfFetchCurrentItems.map(fetchedItem =>
            convertToClientItemFromServer(fetchedItem),
        );
    }, [resultOfFetchCurrentItems]);

    const currentItems = useMemo(
        () =>
            currentAllItems.filter(
                item => item.shoppingPlatformId === selectedShoppingPlatformId,
            ),
        [currentAllItems, selectedShoppingPlatformId],
    );

    const categorySelectItems = useMemo(() => {
        return (
            resultOfFetchCategorySort?.data().categories.map(category => ({
                label: category.name,
                value: category.id,
            })) ?? []
        );
    }, [resultOfFetchCategorySort]);

    return {
        currentItems,
        refreshing,
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
