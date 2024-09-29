import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/shared/models/itemModel';
import {
    SHOPPING_PLATFORM,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';

type ArchiveItemStore = {
    resultOfFetchArchiveItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchArchiveItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    selectedShoppingPlatformId: ShoppingPlatformId;
    setSelectedShoppingPlatformId: (
        selectedShoppingPlatformId: ShoppingPlatformId,
    ) => void;
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
    selectedShoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
    setSelectedShoppingPlatformId: selectedShoppingPlatformId => {
        set({ selectedShoppingPlatformId });
    },
}));
