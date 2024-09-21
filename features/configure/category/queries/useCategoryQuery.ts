import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { useCategoryStore } from '@/features/configure/category/store/useCategoryStore';
import {
    ApiResponseCategory,
    DisplayCategory,
} from '@/features/configure/category/models/categoryModel';

export const useCategoryQuery = () => {
    const { resultOfFetchCategories, refreshing, tempNewCategoryName } =
        useCategoryStore(
            ({ resultOfFetchCategories, refreshing, tempNewCategoryName }) => ({
                resultOfFetchCategories,
                refreshing,
                tempNewCategoryName,
            }),
        );

    const convertToClientCategoryFromServer = (
        fetchedCategory: QueryDocumentSnapshot<ApiResponseCategory>,
    ): DisplayCategory => {
        const data = fetchedCategory.data();
        return {
            ...data,
            id: fetchedCategory.id,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const categories = useMemo(
        () =>
            resultOfFetchCategories.map(fetchedCategory =>
                convertToClientCategoryFromServer(fetchedCategory),
            ),
        [resultOfFetchCategories],
    );

    return {
        categories,
        refreshing,
        tempNewCategoryName,
    };
};
