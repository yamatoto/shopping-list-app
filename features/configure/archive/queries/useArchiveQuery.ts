import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useArchiveItemStore } from '@/features/configure/archive/store/useArchiveStore';
import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';

export const useArchiveQuery = () => {
    const { resultOfFetchArchiveItems, refreshing } = useArchiveItemStore(
        ({ resultOfFetchArchiveItems, refreshing }) => ({
            resultOfFetchArchiveItems,
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

    const archiveItems = useMemo(
        () =>
            resultOfFetchArchiveItems.map(fetchedItem =>
                convertToClientItemFromServer(fetchedItem),
            ),
        [resultOfFetchArchiveItems],
    );

    return {
        archiveItems,
        refreshing,
    };
};
