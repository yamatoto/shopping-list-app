import { useCallback, useEffect } from 'react';

import { showToast } from '@/shared/helpers/toast';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { useArchiveItemStore } from '@/features/configure/archive/store/useArchiveStore';
import { DisplayItem } from '@/shared/models/itemModel';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import { ItemsRepository } from '@/shared/api/itemsRepository';
import {
    SHOPPING_PLATFORM,
    ShoppingPlatform,
} from '@/shared/constants/shoppingPlatform';
import { RakutenItemsRepository } from '@/shared/api/rakutenItemsRepository';
import { AmazonItemsRepository } from '@/shared/api/amazonItemsRepository';

export const useArchiveUsecase = () => {
    const itemsRepository = new ItemsRepository();
    const rakutenItemsRepository = new RakutenItemsRepository();
    const amazonItemsRepository = new AmazonItemsRepository();

    const {
        setResultOfFetchArchiveItems,
        setResultOfFetchAllRakutenItems,
        setResultOfFetchAllAmazonItems,
        setRefreshing,
        setSelectedShoppingPlatform,
        selectedShoppingPlatform,
    } = useArchiveItemStore();
    const { currentUser } = useFirebaseAuth();

    const getRepository = () => {
        return {
            [SHOPPING_PLATFORM.SUPER]: itemsRepository,
            [SHOPPING_PLATFORM.RAKUTEN]: rakutenItemsRepository,
            [SHOPPING_PLATFORM.AMAZON]: amazonItemsRepository,
        }[selectedShoppingPlatform];
    };

    const fetchArchiveItems = useCallback(async () => {
        try {
            const [items, rakutenItems, amazonItems] = await Promise.all([
                itemsRepository.fetchArchiveItems(),
                rakutenItemsRepository.fetchArchiveItems(),
                amazonItemsRepository.fetchArchiveItems(),
            ]);
            setResultOfFetchArchiveItems(items);
            setResultOfFetchAllRakutenItems(rakutenItems);
            setResultOfFetchAllAmazonItems(amazonItems);
        } catch (error: any) {
            console.error(error);
            showToast('アーカイブ買い物リストの取得に失敗しました。');
        }
    }, [currentUser]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchArchiveItems();
        setRefreshing(false);
    }, [fetchArchiveItems]);

    const initialize = useCallback(async () => {
        await fetchArchiveItems();
    }, []);

    const handleDeleteItem = useCallback(
        async ({ id, name }: DisplayItem) => {
            try {
                await getRepository().delete(id);
            } catch (error: any) {
                console.error(error);
                showToast(
                    `アーカイブ買い物リストから「${name}」の削除に失敗しました。`,
                );
                return;
            }

            await fetchArchiveItems();
        },
        [currentUser, fetchArchiveItems, selectedShoppingPlatform],
    );

    const handleRestoreItem = useCallback(
        async (item: DisplayItem, isCurrent: boolean) => {
            const updatedUser = currentUser!.displayName;
            const screenLabel = isCurrent ? SCREEN.CURRENT : SCREEN.FREQUENT;
            try {
                await getRepository().update(
                    {
                        ...item,
                        isCurrent,
                        isFrequent: !isCurrent,
                        updatedUser,
                    },
                    `${selectedShoppingPlatform}の${screenLabel}の買い物リストに「${item.name}」を追加しました。`,
                );
            } catch (error: any) {
                console.error(error);
                showToast(
                    `${selectedShoppingPlatform}の${screenLabel}の買い物リストへの追加に失敗しました。`,
                );
            }

            await fetchArchiveItems();
        },
        [currentUser, fetchArchiveItems, selectedShoppingPlatform],
    );

    useEffect(() => {
        const unsubscribeItems = itemsRepository.setupUpdateListener(
            ({ message, updatedUser }) => {
                if (message) {
                    showToast(`${updatedUser}${message}`);
                }

                fetchArchiveItems().then();
            },
        );
        const unsubscribeRakutenItems =
            rakutenItemsRepository.setupUpdateListener(
                ({ message, updatedUser }) => {
                    showToast(`${updatedUser}${message}`);
                    fetchArchiveItems().then();
                },
            );
        const unsubscribeAmazonItems =
            amazonItemsRepository.setupUpdateListener(
                ({ message, updatedUser }) => {
                    showToast(`${updatedUser}${message}`);
                    fetchArchiveItems().then();
                },
            );
        return () => {
            unsubscribeItems();
            unsubscribeRakutenItems();
            unsubscribeAmazonItems();
        };
    }, [fetchArchiveItems]);

    const handleShoppingPlatformSelect = (
        shoppingPlatform: ShoppingPlatform,
    ) => {
        setSelectedShoppingPlatform(shoppingPlatform);
    };

    return {
        initialize,
        handleRefresh,
        handleDeleteItem,
        handleRestoreItem,
        handleShoppingPlatformSelect,
    };
};
