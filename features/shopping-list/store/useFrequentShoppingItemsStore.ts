import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem, DisplayItem } from '@/shared/models/itemModel';
import { ApiResponseCategorySort } from '@/shared/models/categorySortModel';
import {
    SHOPPING_PLATFORM,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';

type FrequentShoppingItemsStore = {
    resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null;
    setResultOfFetchCategorySort: (
        apiCategories: QueryDocumentSnapshot<ApiResponseCategorySort>,
    ) => void;
    resultOfFetchFrequentItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchFrequentItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    openSections: string[];
    setOpenSections: (
        sections: string[] | ((prev: string[]) => string[]),
    ) => void;
    tempNewItemName: string;
    setTempNewItemName: (newItemName: string) => void;
    selectedShoppingPlatformId: ShoppingPlatformId;
    setSelectedShoppingPlatformId: (
        selectedShoppingPlatform: ShoppingPlatformId,
    ) => void;
    modalVisibleItem: DisplayItem | null;
    setModalVisibleItem: (item: DisplayItem | null) => void;
};

export const useFrequentShoppingItemsStore = create<FrequentShoppingItemsStore>(
    set => ({
        resultOfFetchCategorySort: null,
        setResultOfFetchCategorySort: apiCategorySort => {
            set({ resultOfFetchCategorySort: apiCategorySort });
        },
        resultOfFetchFrequentItems: [],
        setResultOfFetchFrequentItems: apiItems => {
            set({ resultOfFetchFrequentItems: apiItems });
        },
        refreshing: false,
        setRefreshing: (refreshing: boolean) => {
            set({ refreshing });
        },
        openSections: [],
        setOpenSections: (
            sections: string[] | ((prev: string[]) => string[]),
        ) => {
            set(state => {
                if (typeof sections === 'function') {
                    return { openSections: sections(state.openSections) };
                }
                // 初期化時だけ全部セット
                if (sections.length > 1) return { openSections: sections };

                const section = sections[0];
                if (state.openSections.includes(section)) {
                    return {
                        openSections: state.openSections.filter(
                            c => c !== section,
                        ),
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
        modalVisibleItem: null,
        setModalVisibleItem: item => {
            set({ modalVisibleItem: item });
        },
    }),
);
