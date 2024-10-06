import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useArchiveItemStore } from '@/features/configure/archive/store/useArchiveStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP } from '@/shared/constants/shoppingPlatform';

export const useArchiveQuery = () => {
    const {
        resultOfFetchArchiveItems,
        refreshing,
        selectedShoppingPlatformId,
    } = useArchiveItemStore(
        ({
            resultOfFetchArchiveItems,
            refreshing,
            selectedShoppingPlatformId,
        }) => ({
            resultOfFetchArchiveItems,
            refreshing,
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
            shoppingPlatformDetailLabel:
                SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP[
                    data.shoppingPlatformDetailId
                ] ?? '',
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const archiveItems = useMemo(() => {
        return resultOfFetchArchiveItems
            .filter(
                item =>
                    item.data().shoppingPlatformId ===
                    selectedShoppingPlatformId,
            )
            .map(fetchedItem => convertToClientItemFromServer(fetchedItem));
    }, [resultOfFetchArchiveItems, selectedShoppingPlatformId]);

    return {
        archiveItems,
        refreshing,
        selectedShoppingPlatformId,
    };
};
