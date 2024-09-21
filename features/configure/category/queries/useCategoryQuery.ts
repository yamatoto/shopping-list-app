import { useMemo } from 'react';

import { useCategoryStore } from '@/features/configure/category/store/useCategoryStore';

export const useCategoryQuery = () => {
    const { resultOfFetchCategorySort, refreshing, tempNewCategoryName } =
        useCategoryStore(
            ({
                resultOfFetchCategorySort,
                refreshing,
                tempNewCategoryName,
            }) => ({
                resultOfFetchCategorySort,
                refreshing,
                tempNewCategoryName,
            }),
        );

    const categories = useMemo(
        () =>
            resultOfFetchCategorySort
                ?.data()
                .categories.map(({ id, name }) => ({ id, name })),
        [resultOfFetchCategorySort],
    );

    return {
        categories,
        refreshing,
        tempNewCategoryName,
    };
};
