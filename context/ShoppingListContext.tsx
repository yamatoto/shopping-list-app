import React, { createContext, useState, useContext, ReactNode } from 'react';

import { FrequentItem, CurrentItem } from '@/models/item';
import * as CurrentItemsRepository from '@/api/currentItems';
import * as FrequentItemsRepository from '@/api/frequentItems';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

interface ShoppingListContextType {
    currentItems: CurrentItem[];
    frequentItems: FrequentItem[];
    loading: boolean;
    error: string | null;
    fetchAllCurrentItems: () => Promise<CurrentItem[] | undefined>;
    fetchAllFrequentItems: () => Promise<FrequentItem[] | undefined>;
    addCurrentItem: (name: string) => Promise<string | null>;
    addFrequentItem: (name: string) => Promise<string | null>;
    toggleCurrentItem: (currentItem: CurrentItem) => void;
    deleteCurrentItem: (
        iItem: Pick<CurrentItem, 'id' | 'name'>,
    ) => Promise<void>;
    deleteFrequentItem: (
        iItem: Pick<FrequentItem, 'id' | 'name'>,
    ) => Promise<void>;
    addToFrequentFromCurrent: (id: string) => Promise<void>;
    addToCurrentFromFrequent: (id: string) => Promise<void>;
    reorderCurrentItems: (newOrder: CurrentItem[]) => void;
    reorderFrequentItems: (newOrder: FrequentItem[]) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
    undefined,
);

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentItems, setCurrentItems] = useState<CurrentItem[]>([]);
    const [frequentItems, setFrequentItems] = useState<FrequentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUserEmail } = useFirebaseAuth();

    const fetchAllCurrentItems = async () => {
        console.log('fetchAllCurrentItems');
        setLoading(true);
        try {
            const currentItems =
                await CurrentItemsRepository.fetchAllCurrentItems();
            setCurrentItems(currentItems);
            return currentItems;
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllFrequentItems = async () => {
        console.log('fetchAllFrequentItems');
        setLoading(true);
        try {
            const frequentItems =
                await FrequentItemsRepository.fetchAllFrequentItems();
            setFrequentItems(frequentItems);
            return frequentItems;
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateCurrentItem = async (updatedItem: CurrentItem) => {
        console.log('updateCurrentItem');

        try {
            await CurrentItemsRepository.updateCurrentItem(
                updatedItem,
                currentUserEmail!,
            );
            setCurrentItems(prevItems =>
                prevItems.map(item =>
                    item.id === updatedItem.id
                        ? {
                              ...updatedItem,
                              updatedBy: currentUserEmail!,
                              updatedAt: new Date(),
                          }
                        : item,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const updateFrequentItem = async (updatedItem: FrequentItem) => {
        console.log('updateFrequentItem');

        try {
            await FrequentItemsRepository.updateFrequentItem(
                updatedItem,
                currentUserEmail!,
            );
            setFrequentItems(prevItems =>
                prevItems.map(item =>
                    item.id === updatedItem.id
                        ? {
                              ...updatedItem,
                              updatedBy: currentUserEmail!,
                              updatedAt: new Date(),
                          }
                        : item,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const addCurrentItem = async (inputName: string) => {
        console.log('addCurrentItem');
        const trimmedName = inputName.trim();

        // TODO: api取得してチェック
        if (currentItems.some(item => item.name === trimmedName)) {
            // TODO: フロントのリストになければ追加
            return '登録済です。';
        }

        // TODO: apiで既に定番の買い物リストに存在するかチェック
        const isAlreadyInFrequentList = frequentItems.some(
            item => item.name === trimmedName,
        );

        try {
            const currentItem = await CurrentItemsRepository.addCurrentItem(
                trimmedName,
                isAlreadyInFrequentList,
                currentUserEmail!,
            );
            setCurrentItems([...currentItems, currentItem]);
        } catch (error) {
            console.error(error);
            return null;
        }

        // 追加した直近アイテムが定番リストにあれば、定番リストの方を「追加済み」に更新
        const frequentItem = frequentItems.find(
            item => item.name === trimmedName,
        );
        if (!frequentItem) return null;

        await updateFrequentItem({
            ...frequentItem,
            isAddedToCurrent: true,
        });
        return null;
    };

    const addFrequentItem = async (inputName: string) => {
        console.log('addFrequentItem');
        const trimmedName = inputName.trim();

        // TODO: api取得してチェック
        if (frequentItems.some(item => item.name === trimmedName)) {
            // TODO: フロントのリストになければ追加
            return '登録済です。';
        }

        // TODO: apiで既に直近の買い物リストに存在するかチェック
        const isAlreadyInCurrentList = currentItems.some(
            item => item.name === trimmedName,
        );

        try {
            const frequentItem = await FrequentItemsRepository.addFrequentItem(
                trimmedName,
                isAlreadyInCurrentList,
                currentUserEmail!,
            );
            setFrequentItems([...frequentItems, frequentItem]);
        } catch (error) {
            console.error(error);
            return null;
        }

        // 追加した定番アイテムが直近リストにあれば、直近リストの方を「追加済み」に更新
        const currentItem = currentItems.find(
            item => item.name === trimmedName,
        );
        if (!currentItem) return null;

        await updateCurrentItem({
            ...currentItem,
            isAddedToFrequent: true,
        });
        return null;
    };

    const toggleCurrentItem = async (currentItem: CurrentItem) => {
        console.log('toggleCurrentItem');
        try {
            const updated = await CurrentItemsRepository.updateCurrentItem(
                {
                    ...currentItem,
                    completed: !currentItem.completed,
                },
                currentUserEmail!,
            );

            setCurrentItems(
                currentItems.map(item =>
                    item.id === updated.id
                        ? { ...item, completed: updated.completed }
                        : item,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCurrentItem = async ({
        id,
        name,
    }: Pick<CurrentItem, 'id' | 'name'>) => {
        console.log('deleteCurrentItem');
        try {
            await CurrentItemsRepository.deleteCurrentItem(id);
        } catch (error) {
            console.error(error);
        } finally {
            setCurrentItems(currentItems.filter(item => item.id !== id));
        }

        // 削除した直近アイテムが定番リストにあれば、定番リストの方を未追加にする
        const frequentItem = frequentItems.find(item => item.name === name);
        if (!frequentItem || !frequentItem.isAddedToCurrent) return;
        await updateFrequentItem({ ...frequentItem, isAddedToCurrent: false });
    };

    const deleteFrequentItem = async ({
        id,
        name,
    }: Pick<FrequentItem, 'id' | 'name'>) => {
        console.log('deleteFrequentItem');
        try {
            await FrequentItemsRepository.deleteFrequentItem(id);
        } catch (error) {
            console.error(error);
        } finally {
            setFrequentItems(frequentItems.filter(item => item.id !== id));
        }

        // 削除した直近アイテムが定番リストにあれば、定番リストの方を未追加にする
        const currentItem = currentItems.find(item => item.name === name);
        if (!currentItem || !currentItem.isAddedToFrequent) return;
        await updateCurrentItem({ ...currentItem, isAddedToFrequent: false });
    };

    const addToFrequentFromCurrent = async (id: string) => {
        console.log('addToFrequentFromCurrent');
        const itemToAdd = currentItems.find(item => item.id === id);
        if (!itemToAdd) return; // ありえない
        if (itemToAdd.isAddedToFrequent) return; // ありえない

        await Promise.all([
            updateCurrentItem({ ...itemToAdd, isAddedToFrequent: true }),
            addFrequentItem(itemToAdd.name),
        ]);
    };

    const addToCurrentFromFrequent = async (id: string) => {
        console.log('addToCurrentFromFrequent');
        const itemToAdd = frequentItems.find(item => item.id === id);
        if (!itemToAdd) return; // ありえない
        if (itemToAdd.isAddedToCurrent) return; // ありえない

        await Promise.all([
            updateFrequentItem({ ...itemToAdd, isAddedToCurrent: true }),
            addCurrentItem(itemToAdd.name),
        ]);
    };

    const reorderCurrentItems = (newOrder: CurrentItem[]) => {
        console.log('reorderCurrentItems');
        setCurrentItems(newOrder);
    };

    const reorderFrequentItems = (newOrder: FrequentItem[]) => {
        console.log('reorderFrequentItems');
        setFrequentItems(newOrder);
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
                toggleCurrentItem,
                deleteCurrentItem,
                deleteFrequentItem,
                addToFrequentFromCurrent,
                addToCurrentFromFrequent,
                reorderCurrentItems,
                reorderFrequentItems,
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
