import { useCallback } from 'react';
import Toast from 'react-native-simple-toast';

import { useShoppingItemsStore } from '@/store/useShoppingItemsStore';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import * as ItemsRepository from '@/api/ItemsRepository';
import { DisplayItem } from '@/models/itemModel';

export const useShoppingListUsecase = () => {
    const { setResultOfFetchAllItems, setRefreshing } = useShoppingItemsStore();
    const { currentUser } = useFirebaseAuth();

    const fetchAllItems = useCallback(async () => {
        try {
            const items = await ItemsRepository.fetchAllItems();
            setResultOfFetchAllItems(items);
        } catch (error: any) {
            console.error(error);
            Toast.show('買い物リストの取得に失敗しました。', 300, {});
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllItems();
        setRefreshing(false);
    }, [fetchAllItems]);

    const handleAddItem = useCallback(
        async (newItemName: string, isCurrent: boolean) => {
            const trimmedItem = newItemName.trim();
            if (!trimmedItem) return;
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.addItem({
                    name: trimmedItem,
                    quantity: 1,
                    isCurrent,
                    isFrequent: !isCurrent,
                    createdUser: userEmail,
                    updatedUser: userEmail,
                });
            } catch (error: any) {
                console.error(error);
                Toast.show('買い物リストの追加に失敗しました。', 300, {});
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleUpdateItem = useCallback(
        async (updateItem: DisplayItem) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem({
                    ...updateItem,
                    updatedUser: userEmail,
                });
            } catch (error: any) {
                console.error(error);
                Toast.show('買い物リストの更新に失敗しました。', 300, {});
            }
            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleDeleteItem = useCallback(
        async ({ id }: DisplayItem, isCurrent: boolean) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem({
                    ...(isCurrent
                        ? { isCurrent: false }
                        : { isFrequent: false }),
                    id,
                    updatedUser: userEmail,
                });
            } catch (error: any) {
                console.error(error);
                Toast.show('買い物リストの削除に失敗しました。', 300, {});
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleAddToFrequent = useCallback(
        async (item: DisplayItem) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem({
                    ...item,
                    isFrequent: true,
                    updatedUser: userEmail,
                });
            } catch (error: any) {
                console.error(error);
                Toast.show(
                    '定番の買い物リストへの追加に失敗しました。',
                    300,
                    {},
                );
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const handleAddToCurrent = useCallback(
        async (item: DisplayItem) => {
            const userEmail = currentUser!.email;
            try {
                await ItemsRepository.updateItem({
                    ...item,
                    isCurrent: true,
                    updatedUser: userEmail,
                });
            } catch (error: any) {
                console.error(error);
                Toast.show(
                    '直近の買い物リストへの追加に失敗しました。',
                    300,
                    {},
                );
            }

            await fetchAllItems();
        },
        [currentUser, fetchAllItems],
    );

    const initialize = useCallback(async () => {
        await fetchAllItems();
    }, []);

    return {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToFrequent,
        handleAddToCurrent,
    };
};
