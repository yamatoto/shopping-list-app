import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/shared/models/itemModel';

type ArchiveItemStore = {
    resultOfFetchArchiveItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchArchiveItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
};

export const useArchiveItemStore = create<ArchiveItemStore>(set => ({
    resultOfFetchArchiveItems: [],
    setResultOfFetchArchiveItems: apiItems => {
        set({ resultOfFetchArchiveItems: apiItems });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
}));
