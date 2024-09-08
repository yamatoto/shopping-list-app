import React, { createContext, useState, useContext, ReactNode } from 'react';

import { FrequentItem, CurrentItem } from '@/models/itemModelOld';
import * as CurrentItemsRepository from '@/api/currentItemsRepository';
import * as FrequentItemsRepository from '@/api/frequentItemsRepository';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

interface ShoppingListContextType {
    currentItems: CurrentItem[];
    frequentItems: FrequentItem[];
    loading: boolean;
    error: string | null;
    fetchAllCurrentItems: () => Promise<void>;
    fetchAllFrequentItems: () => Promise<void>;
    addCurrentItem: (name: string) => Promise<void>;
    addFrequentItem: (name: string) => Promise<void>;
    deleteCurrentItem: (
        iItem: Pick<CurrentItem, 'id' | 'name'>,
    ) => Promise<void>;
    deleteFrequentItem: (
        iItem: Pick<FrequentItem, 'id' | 'name'>,
    ) => Promise<void>;
    addToFrequentFromCurrent: (currentItem: CurrentItem) => Promise<void>;
    addToCurrentFromFrequent: (frequentItem: FrequentItem) => Promise<void>;
    reorderCurrentItems: (newOrder: CurrentItem[]) => Promise<void>;
    reorderFrequentItems: (newOrder: FrequentItem[]) => Promise<void>;
    updateCurrentItem: (updatedItem: CurrentItem) => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
    undefined,
);

const INITIAL_ORDER = 1000000; // 初期順序値
const ORDER_STEP = 1000; // 順序値の間隔

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentItems, setCurrentItems] = useState<CurrentItem[]>([]);
    const [frequentItems, setFrequentItems] = useState<FrequentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useFirebaseAuth();

    const fetchAllCurrentItems = async () => {
        setLoading(true);
        try {
            const currentItems = await CurrentItemsRepository.fetchAllItems();
            setCurrentItems(currentItems);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllFrequentItems = async () => {
        setLoading(true);
        try {
            const frequentItems = await FrequentItemsRepository.fetchAllItems();
            setFrequentItems(frequentItems);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateCurrentItem = async (updatedItem: CurrentItem) => {
        try {
            await CurrentItemsRepository.updateItem(
                updatedItem,
                currentUser!.email,
            );
            await fetchAllCurrentItems();
        } catch (error) {
            console.error(error);
        }
    };

    const updateFrequentItem = async (updatedItem: FrequentItem) => {
        try {
            await FrequentItemsRepository.updateItem(
                updatedItem,
                currentUser!.email,
            );
            await fetchAllFrequentItems();
        } catch (error) {
            console.error(error);
        }
    };

    const getCurrentLatestSortOrder = async () => {
        const latestItem = await CurrentItemsRepository.fetchLatestItem();
        return latestItem ? latestItem.sortOrder + ORDER_STEP : INITIAL_ORDER;
    };

    const addCurrentItem = async (inputName: string) => {
        const trimmedName = inputName.trim();
        const registeredCurrentList =
            await CurrentItemsRepository.findItemByName(trimmedName);
        if (registeredCurrentList) {
            fetchAllCurrentItems().then();
            throw new Error('登録済です。');
        }

        const [sortOrder, registeredFrequentList] = await Promise.all([
            getCurrentLatestSortOrder(),
            FrequentItemsRepository.findItemByName(trimmedName),
        ]);

        await CurrentItemsRepository.addItem({
            name: trimmedName,
            sortOrder,
            isAddedToFrequent: !!registeredFrequentList,
            userEmail: currentUser!.email,
        });
        await fetchAllCurrentItems();

        // 追加した直近アイテムが定番リストにあれば、定番リストの方を「追加済み」に更新
        if (!registeredFrequentList) return;

        await updateFrequentItem({
            ...registeredFrequentList,
            isAddedToCurrent: true,
        });
    };

    const getFrequentLatestSortOrder = async () => {
        const latestItem = await FrequentItemsRepository.fetchLatestItem();
        return latestItem ? latestItem.sortOrder + ORDER_STEP : INITIAL_ORDER;
    };

    const addFrequentItem = async (inputName: string) => {
        const trimmedName = inputName.trim();

        const registeredFrequentList =
            await FrequentItemsRepository.findItemByName(trimmedName);
        if (registeredFrequentList) {
            fetchAllCurrentItems().then();
            throw new Error('登録済です。');
        }

        const [sortOrder, registeredCurrentList] = await Promise.all([
            getFrequentLatestSortOrder(),
            CurrentItemsRepository.findItemByName(trimmedName),
        ]);

        await FrequentItemsRepository.addItem({
            name: trimmedName,
            sortOrder,
            isAddedToCurrent: !!registeredCurrentList,
            userEmail: currentUser!.email,
        });
        await fetchAllFrequentItems();

        // 追加した定番アイテムが直近リストにあれば、直近リストの方を「追加済み」に更新
        if (!registeredCurrentList) return;

        await updateCurrentItem({
            ...registeredCurrentList,
            isAddedToFrequent: true,
        });
    };

    const deleteCurrentItem = async ({
        id,
        name,
    }: Pick<CurrentItem, 'id' | 'name'>) => {
        console.log('deleteCurrentItem');
        try {
            await CurrentItemsRepository.deleteItem(id);
        } finally {
            setCurrentItems(currentItems.filter(item => item.id !== id));
        }

        // 削除した直近アイテムが定番リストにあれば、定番リストの方を未追加にする
        const frequentItem = await FrequentItemsRepository.findItemByName(name);
        if (!frequentItem || !frequentItem.isAddedToCurrent) return;
        await updateFrequentItem({ ...frequentItem, isAddedToCurrent: false });
    };

    const deleteFrequentItem = async ({
        id,
        name,
    }: Pick<FrequentItem, 'id' | 'name'>) => {
        try {
            await FrequentItemsRepository.deleteItem(id);
        } catch (error) {
            console.error(error);
        } finally {
            setFrequentItems(frequentItems.filter(item => item.id !== id));
        }

        // 削除した定番アイテムが直近リストにあれば、直近リストの方を未追加にする
        const currentItem = await CurrentItemsRepository.findItemByName(name);
        if (!currentItem || !currentItem.isAddedToFrequent) return;
        await updateCurrentItem({ ...currentItem, isAddedToFrequent: false });
    };

    const addToFrequentFromCurrent = async (currentItem: CurrentItem) => {
        await Promise.all([
            updateCurrentItem({ ...currentItem, isAddedToFrequent: true }),
            addFrequentItem(currentItem.name),
        ]);
    };

    const addToCurrentFromFrequent = async (frequentItem: FrequentItem) => {
        await Promise.all([
            updateFrequentItem({ ...frequentItem, isAddedToCurrent: true }),
            addCurrentItem(frequentItem.name),
        ]);
    };

    const reorderCurrentItems = async (reorderedItems: CurrentItem[]) => {
        const updates = reorderedItems.map((item, index) => ({
            id: item.id,
            sortOrder: (index + 1) * ORDER_STEP,
        }));
        await CurrentItemsRepository.batchUpdateItems(updates);
        await fetchAllCurrentItems();
    };

    const reorderFrequentItems = async (reorderedItems: FrequentItem[]) => {
        const updates = reorderedItems.map((item, index) => ({
            id: item.id,
            sortOrder: (index + 1) * ORDER_STEP,
        }));
        await FrequentItemsRepository.batchUpdateItems(updates);
        await fetchAllFrequentItems();
    };

    return (
        <ShoppingListContext.Provider
            value={{
                currentItems,
                frequentItems,
                loading,
                error,
                fetchAllCurrentItems,
                fetchAllFrequentItems,
                addCurrentItem,
                addFrequentItem,
                deleteCurrentItem,
                deleteFrequentItem,
                addToFrequentFromCurrent,
                addToCurrentFromFrequent,
                reorderCurrentItems,
                reorderFrequentItems,
                updateCurrentItem,
            }}
        >
            {children}
        </ShoppingListContext.Provider>
    );
};

export const useShoppingList = () => {
    const context = useContext(ShoppingListContext);
    if (context === undefined) {
        throw new Error(
            'useShoppingList must be used within a ShoppingListProvider',
        );
    }
    return context;
};
