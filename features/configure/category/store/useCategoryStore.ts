import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseCategorySort } from '@/shared/models/categorySortModel';

type CategoryStore = {
    resultOfFetchCategorySort: QueryDocumentSnapshot<ApiResponseCategorySort> | null;
    setResultOfFetchCategorySort: (
        apiCategories: QueryDocumentSnapshot<ApiResponseCategorySort>,
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    tempNewCategoryName: string;
    setTempNewCategoryName: (tempNewCategoryName: string) => void;
};

export const useCategoryStore = create<CategoryStore>(set => ({
    resultOfFetchCategorySort: null,
    setResultOfFetchCategorySort: apiCategorySort => {
        set({ resultOfFetchCategorySort: apiCategorySort });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
    tempNewCategoryName: '',
    setTempNewCategoryName: (tempNewCategoryName: string) => {
        set({ tempNewCategoryName });
    },
}));
