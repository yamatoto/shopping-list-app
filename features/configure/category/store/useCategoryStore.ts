import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseCategory } from '@/features/configure/category/models/categoryModel';

type CategoryStore = {
    resultOfFetchCategories: QueryDocumentSnapshot<ApiResponseCategory>[];
    setResultOfFetchCategories: (
        apiCategories: QueryDocumentSnapshot<ApiResponseCategory>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    tempNewCategoryName: string;
    setTempNewCategoryName: (tempNewCategoryName: string) => void;
};

export const useCategoryStore = create<CategoryStore>(set => ({
    resultOfFetchCategories: [],
    setResultOfFetchCategories: apiCategories => {
        set({ resultOfFetchCategories: apiCategories });
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
