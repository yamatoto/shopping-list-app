import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { showToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { useCategoryStore } from '@/features/configure/category/store/useCategoryStore';
import { CategorySortRepository } from '@/shared/api/categorySortRepository';
import { CategoryModel } from '@/shared/models/categorySortModel';

export const useCategoryUsecase = () => {
    const categorySortRepository = new CategorySortRepository();
    const {
        setResultOfFetchCategorySort,
        setRefreshing,
        setTempNewCategoryName,
    } = useCategoryStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllCategories = useCallback(async () => {
        try {
            const categorySortApi = await categorySortRepository.fetchOne();
            setResultOfFetchCategorySort(categorySortApi);
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

    useEffect(() => {
        const unsubscribe = categorySortRepository.setupUpdateListener(
            ({ message, updatedUser }) => {
                if (message) {
                    showToast(`${updatedUser}${message}`);
                }

                fetchAllCategories().then();
            },
        );
        return () => unsubscribe();
    }, [fetchAllCategories]);

    const checkCategoryExists = useCallback(async (newCategoryName: string) => {
        const categorySortApi = await categorySortRepository.fetchOne();
        const fetchedCategories = categorySortApi.data().categories;
        return {
            exists: fetchedCategories.some(
                ({ name }) => name === newCategoryName,
            ),
            categorySortApiId: categorySortApi.id,
            fetchedCategories,
        };
    }, []);

    const handleAddCategory = useCallback(
        async (newCategoryName: string) => {
            if (!newCategoryName.trim()) return;
            try {
                const { exists, categorySortApiId, fetchedCategories } =
                    await checkCategoryExists(newCategoryName);
                if (exists) {
                    showToast(`${newCategoryName}はすでに登録されています。`);
                    return;
                }

                await categorySortRepository.update(
                    {
                        id: categorySortApiId,
                        updatedUser: currentUser!.displayName,
                        categories: [
                            ...fetchedCategories,
                            { id: uuidv4(), name: newCategoryName },
                        ],
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
        async (beforeCategory: CategoryModel, updateCategoryName: string) => {
            const trimmedName = updateCategoryName.trim();
            if (!trimmedName) return;

            try {
                const { exists, categorySortApiId, fetchedCategories } =
                    await checkCategoryExists(trimmedName);
                if (exists) {
                    showToast(`${trimmedName}はすでに登録されています。`);
                    return;
                }

                await categorySortRepository.update(
                    {
                        id: categorySortApiId,
                        updatedUser: currentUser!.displayName,
                        categories: fetchedCategories.map(category =>
                            category.id === beforeCategory.id
                                ? { ...beforeCategory, name: trimmedName }
                                : category,
                        ),
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

    const handleDeleteCategory = useCallback(
        async ({ id, name }: CategoryModel) => {
            try {
                const categorySortApi = await categorySortRepository.fetchOne();
                const fetchedCategories = categorySortApi.data().categories;
                await categorySortRepository.update(
                    {
                        id: categorySortApi.id,
                        updatedUser: currentUser!.displayName,
                        categories: fetchedCategories.filter(
                            category => category.id !== id,
                        ),
                    },
                    `カテゴリーの「${name}」を削除しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(`カテゴリーの「${name}」の削除に失敗しました。`);
                return;
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
