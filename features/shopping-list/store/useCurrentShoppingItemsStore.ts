import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { ApiResponseCategorySort } from '@/shared/models/categorySortModel';
import {
    SHOPPING_PLATFORM,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';

type CurrentShoppingItemsStore = {
    resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null;
    setResultOfFetchCategorySort: (
        apiCategories: QueryDocumentSnapshot<ApiResponseCategorySort>,
    ) => void;
    resultOfFetchCurrentItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchCurrentItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    tempNewItemName: string;
    setTempNewItemName: (newItemName: string) => void;
    selectedShoppingPlatformId: ShoppingPlatformId;
    setSelectedShoppingPlatformId: (
        selectedShoppingPlatform: ShoppingPlatformId,
    ) => void;
    modalVisibleItem: DisplayItem | null;
    setModalVisibleItem: (item: DisplayItem | null) => void;
};

export const useCurrentShoppingItemsStore = create<CurrentShoppingItemsStore>(
    set => ({
        resultOfFetchCategorySort: null,
        setResultOfFetchCategorySort: apiCategorySort => {
            set({ resultOfFetchCategorySort: apiCategorySort });
        },
        resultOfFetchCurrentItems: [],
        setResultOfFetchCurrentItems: apiItems => {
            set({ resultOfFetchCurrentItems: apiItems });
        },
        refreshing: false,
        setRefreshing: (refreshing: boolean) => {
            set({ refreshing });
        },
        tempNewItemName: '',
        setTempNewItemName: tempNewItemName => {
            set({ tempNewItemName });
        },
        selectedShoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
        setSelectedShoppingPlatformId: platform => {
            set({ selectedShoppingPlatformId: platform });
        },
        modalVisibleItem: null,
        setModalVisibleItem: item => {
            set({ modalVisibleItem: item });
        },
    }),
);
