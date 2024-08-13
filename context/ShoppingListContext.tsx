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
    fetchCurrentItems: () => Promise<CurrentItem[] | undefined>;
    fetchFrequentItems: () => Promise<FrequentItem[] | undefined>;
    addCurrentItem: (name: string) => Promise<string | null>;
    addFrequentItem: (name: string) => Promise<string | null>;
    toggleCurrentItem: (currentItem: CurrentItem) => void;
    deleteCurrentItem: (id: string) => void;
    deleteFrequentItem: (id: string) => void;
    addToCurrentFromFrequent: (id: string) => void;
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

    const fetchCurrentItems = async () => {
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

    const fetchFrequentItems = async () => {
        const frequentItems =
            await FrequentItemsRepository.fetchAllFrequentItems();
        setFrequentItems(frequentItems);
        return frequentItems;
    };

    const addCurrentItem = async (inputName: string) => {
        const trimmedName = inputName.trim();

        // TODO: api取得してチェック
        if (currentItems.some(item => item.name === trimmedName)) {
            return '登録済です。';
        }

        try {
            const currentItem = await CurrentItemsRepository.addCurrentItem(
                trimmedName,
                currentUserEmail!,
            );
            setCurrentItems([...currentItems, currentItem]);
        } catch (error) {
            console.error(error);
        }

        // TODO: 定番リストにあれば「追加済み」に更新 api
        setFrequentItems(prevFrequentItems =>
            prevFrequentItems.map(item =>
                item.name === trimmedName ? { ...item, isAdded: true } : item,
            ),
        );

        return null;
    };

    const addFrequentItem = async (inputName: string) => {
        const trimmedName = inputName.trim();

        // TODO: api取得してチェック
        if (frequentItems.some(item => item.name === trimmedName)) {
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
        }

        return null;
    };

    const toggleCurrentItem = async (currentItem: CurrentItem) => {
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

    const deleteCurrentItem = async (id: string) => {
        try {
            await CurrentItemsRepository.deleteCurrentItem(id);
        } catch (error) {
            console.error(error);
        } finally {
            setCurrentItems(currentItems.filter(item => item.id !== id));
        }

        const deletedItem = currentItems.find(item => item.id === id);
        if (!deletedItem) return;

        try {
            await deleteFrequentItem(id);
        } catch (error) {
            console.error(error);
        } finally {
            setFrequentItems(
                frequentItems.map(item => {
                    if (item.name === deletedItem.name) {
                        console.log('Matching frequent item found:', item);
                        return { ...item, isAdded: false };
                    }
                    return item;
                }),
            );
        }
    };

    const deleteFrequentItem = async (id: string) => {
        try {
            await FrequentItemsRepository.deleteFrequentItem(id);
        } catch (error) {
            console.error(error);
        } finally {
            setFrequentItems(prevItems =>
                prevItems.filter(item => item.id !== id),
            );
        }
    };

    const addToCurrentFromFrequent = async (id: string) => {
        const itemToAdd = frequentItems.find(item => item.id === id);
        if (itemToAdd && !itemToAdd.isAdded) {
            await addCurrentItem(itemToAdd.name);
            let updated;
            const updatedList = frequentItems.map(item => {
                if (item.id === id) {
                    updated = { ...item, isAdded: true };
                    return updated;
                }
                return item;
            });
            setFrequentItems(updatedList);
            await FrequentItemsRepository.updateFrequentItem(
                updated!,
                currentUserEmail!,
            );
        }
    };

    const reorderCurrentItems = (newOrder: CurrentItem[]) => {
        setCurrentItems(newOrder);
    };

    const reorderFrequentItems = (newOrder: FrequentItem[]) => {
        setFrequentItems(newOrder);
    };

    return (
        <ShoppingListContext.Provider
            value={{
                currentItems,
                frequentItems,
                loading,
                error,
                fetchCurrentItems,
                fetchFrequentItems,
                addCurrentItem,
                addFrequentItem,
                toggleCurrentItem,
                deleteCurrentItem,
                deleteFrequentItem,
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
