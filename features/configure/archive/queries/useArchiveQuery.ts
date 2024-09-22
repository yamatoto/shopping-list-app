import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useArchiveItemStore } from '@/features/configure/archive/store/useArchiveStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { SHOPPING_PLATFORM } from '@/shared/constants/shoppingPlatform';

export const useArchiveQuery = () => {
    const {
        resultOfFetchArchiveItems,
        refreshing,
        resultOfFetchAllAmazonItems,
        resultOfFetchAllRakutenItems,
        selectedShoppingPlatform,
    } = useArchiveItemStore(
        ({
            resultOfFetchArchiveItems,
            refreshing,
            resultOfFetchAllAmazonItems,
            resultOfFetchAllRakutenItems,
            selectedShoppingPlatform,
        }) => ({
            resultOfFetchArchiveItems,
            refreshing,
            resultOfFetchAllAmazonItems,
            resultOfFetchAllRakutenItems,
            selectedShoppingPlatform,
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

    const archiveItems = useMemo(() => {
        const items = {
            [SHOPPING_PLATFORM.SUPER]: resultOfFetchArchiveItems,
            [SHOPPING_PLATFORM.RAKUTEN]: resultOfFetchAllRakutenItems,
            [SHOPPING_PLATFORM.AMAZON]: resultOfFetchAllAmazonItems,
        }[selectedShoppingPlatform];
        return items.map(fetchedItem =>
            convertToClientItemFromServer(fetchedItem),
        );
    }, [
        resultOfFetchArchiveItems,
        resultOfFetchAllRakutenItems,
        resultOfFetchAllAmazonItems,
        selectedShoppingPlatform,
    ]);

    return {
        archiveItems,
        refreshing,
        selectedShoppingPlatform,
    };
};
