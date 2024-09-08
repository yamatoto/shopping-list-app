import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/features/shopping-list/models/itemModel';
import { ApiResponseItemSort } from '@/features/shopping-list/models/itemSortModel';

type ShoppingItemsStore = {
    resultOfFetchAllItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchAllItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    resultOfFetchItemSortList: QueryDocumentSnapshot<ApiResponseItemSort>[];
    setResultOfFetchItemSortList: (
        apiSortList: QueryDocumentSnapshot<ApiResponseItemSort>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
};

export const useShoppingItemsStore = create<ShoppingItemsStore>(set => ({
    resultOfFetchAllItems: [],
    setResultOfFetchAllItems: apiItems => {
        set({ resultOfFetchAllItems: apiItems });
    },
    resultOfFetchItemSortList: [],
    setResultOfFetchItemSortList: apiSortList => {
        set({ resultOfFetchItemSortList: apiSortList });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
}));
