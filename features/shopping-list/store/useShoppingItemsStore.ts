import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/shared/models/itemModel';
import { ApiResponseCategorySort } from '@/shared/models/categorySortModel';
import {
    SHOPPING_PLATFORM,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';

type ShoppingItemsStore = {
    resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null;
    setResultOfFetchCategorySort: (
        apiCategories: QueryDocumentSnapshot<ApiResponseCategorySort>,
    ) => void;
    resultOfFetchAllItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchAllItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    openSections: string[];
    setOpenSections: (sections: string[]) => void;
    tempNewItemName: string;
    setTempNewItemName: (newItemName: string) => void;
    selectedShoppingPlatformId: ShoppingPlatformId;
    setSelectedShoppingPlatformId: (
        selectedShoppingPlatform: ShoppingPlatformId,
    ) => void;
};

export const useShoppingItemsStore = create<ShoppingItemsStore>(set => ({
    resultOfFetchCategorySort: null,
    setResultOfFetchCategorySort: apiCategorySort => {
        set({ resultOfFetchCategorySort: apiCategorySort });
    },
    resultOfFetchAllItems: [],
    setResultOfFetchAllItems: apiItems => {
        set({ resultOfFetchAllItems: apiItems });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
    openSections: [],
    setOpenSections: (sections: string[]) => {
        set(state => {
            // 初期化時だけ全部セット
            if (sections.length > 1) return { openSections: sections };

            const section = sections[0];
            if (state.openSections.includes(section)) {
                return {
                    openSections: state.openSections.filter(c => c !== section),
                };
            }
            return { openSections: [...state.openSections, section] };
        });
    },
    tempNewItemName: '',
    setTempNewItemName: tempNewItemName => {
        set({ tempNewItemName });
    },
    selectedShoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
    setSelectedShoppingPlatformId: platform => {
        set({ selectedShoppingPlatformId: platform });
    },
}));
