import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/shared/models/itemModel';
import {
    SHOPPING_PLATFORM,
    ShoppingPlatform,
} from '@/shared/constants/shoppingPlatform';

type ArchiveItemStore = {
    resultOfFetchArchiveItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchArchiveItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    resultOfFetchAllRakutenItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchAllRakutenItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    resultOfFetchAllAmazonItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchAllAmazonItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;

    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    selectedShoppingPlatform: ShoppingPlatform;
    setSelectedShoppingPlatform: (
        selectedShoppingPlatform: ShoppingPlatform,
    ) => void;
};

export const useArchiveItemStore = create<ArchiveItemStore>(set => ({
    resultOfFetchArchiveItems: [],
    setResultOfFetchArchiveItems: apiItems => {
        set({ resultOfFetchArchiveItems: apiItems });
    },
    resultOfFetchAllRakutenItems: [],
    setResultOfFetchAllRakutenItems: apiItems => {
        set({ resultOfFetchAllRakutenItems: apiItems });
    },
    resultOfFetchAllAmazonItems: [],
    setResultOfFetchAllAmazonItems: apiItems => {
        set({ resultOfFetchAllAmazonItems: apiItems });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
    selectedShoppingPlatform: SHOPPING_PLATFORM.SUPER,
    setSelectedShoppingPlatform: selectedShoppingPlatform => {
        set({ selectedShoppingPlatform });
    },
}));
