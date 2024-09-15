import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/features/shopping-list/models/itemModel';

type ShoppingItemsStore = {
    resultOfFetchAllItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchAllItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
};

export const useShoppingItemsStore = create<ShoppingItemsStore>(set => ({
    resultOfFetchAllItems: [],
    setResultOfFetchAllItems: apiItems => {
        set({ resultOfFetchAllItems: apiItems });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
}));
