import { useCallback, useEffect } from 'react';

import { showToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { useCategoryStore } from '@/features/configure/category/store/useCategoryStore';
import * as CategoriesRepository from '@/features/configure/category/api/categoriesRepository';
import { DisplayCategory } from '@/features/configure/category/models/categoryModel';

export const useCategoryUsecase = () => {
    const {
        setResultOfFetchCategories,
        setRefreshing,
        setTempNewCategoryName,
    } = useCategoryStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllCategories = useCallback(async () => {
        try {
            const categories = await CategoriesRepository.fetchAllCategories();
            setResultOfFetchCategories(categories);
        } catch (error: any) {
            console.error(error);
            showToast('カテゴリーリストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllCategories();
        setRefreshing(false);
    }, [fetchAllCategories]);

    const initialize = useCallback(async () => {
        await fetchAllCategories();
    }, []);

    const handleDeleteCategory = useCallback(
        async ({ id, name }: DisplayCategory) => {
            try {
                await CategoriesRepository.deleteCategory(id);
            } catch (error: any) {
                console.error(error);
                showToast(
                    `カテゴリーリストの「${name}」の削除に失敗しました。`,
                );
                return;
            }

            await fetchAllCategories();
        },
        [currentUser, fetchAllCategories],
    );

    useEffect(() => {
        const unsubscribe = CategoriesRepository.setupCategoryListener(
            ({ message, updatedUserName }) => {
                if (message) {
                    showToast(`${updatedUserName}${message}`);
                }

                fetchAllCategories().then();
            },
        );
        return () => unsubscribe();
    }, [fetchAllCategories]);

    const handleAddCategory = useCallback(
        async (newCategoryName: string) => {
            if (!newCategoryName.trim()) return;
            const createdUser = currentUser!.displayName;
            try {
                const fetchedCategory =
                    await CategoriesRepository.findCategoryByName(
                        newCategoryName,
                    );
                if (fetchedCategory) {
                    showToast(`${newCategoryName}はすでに登録されています。`);
                    return;
                }

                await CategoriesRepository.addCategory(
                    {
                        name: newCategoryName,
                        createdUserName: createdUser,
                        updatedUserName: createdUser,
                    },
                    `カテゴリー「${newCategoryName}」を追加しました。`,
                );
                setTempNewCategoryName('');
            } catch (error: any) {
                console.error(error);
                showToast(`カテゴリーの追加に失敗しました。`);
                return;
            }

            await fetchAllCategories();
        },
        [currentUser, fetchAllCategories],
    );

    const handleUpdateCategory = useCallback(
        async (beforeCategory: DisplayCategory, updateCategoryName: string) => {
            const trimmedName = updateCategoryName.trim();
            if (!trimmedName) return;

            try {
                const fetchedCategory =
                    await CategoriesRepository.findCategoryByName(trimmedName);
                if (fetchedCategory) {
                    showToast(`${trimmedName}はすでに登録されています。`);
                    return;
                }

                await CategoriesRepository.updateCategory(
                    {
                        ...beforeCategory,
                        ...{ name: trimmedName },
                        updatedUserName: currentUser!.displayName,
                    },
                    `カテゴリーの「${beforeCategory.name}」を「${trimmedName}」に更新しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`カテゴリーの更新に失敗しました。`);
            }

            await fetchAllCategories();
        },
        [currentUser, fetchAllCategories],
    );
    return {
        initialize,
        handleRefresh,
        handleDeleteCategory,
        handleAddCategory,
        handleUpdateCategory,
        setTempNewCategoryName,
    };
};
