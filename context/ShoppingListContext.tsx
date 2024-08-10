import React, { createContext, useState, useContext, ReactNode } from 'react';

import { FrequentItem, Item } from '@/models/item';

interface ShoppingListContextType {
    currentItems: Item[];
    frequentItems: FrequentItem[];
    addCurrentItem: (name: string) => string | null;
    addFrequentItem: (name: string) => string | null;
    toggleCurrentItem: (id: number) => void;
    deleteCurrentItem: (id: number) => void;
    addToCurrentFromFrequent: (id: number) => void;
    reorderCurrentItems: (newOrder: Item[]) => void;
    reorderFrequentItems: (newOrder: FrequentItem[]) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
    undefined,
);

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentItems, setCurrentItems] = useState<Item[]>([]);
    const [frequentItems, setFrequentItems] = useState<FrequentItem[]>([]);

    const addCurrentItem = (inputValue: string) => {
        const trimmedValue = inputValue.trim();

        if (currentItems.some(item => item.name === trimmedValue)) {
            return '登録済です。';
        }

        setCurrentItems([
            ...currentItems,
            { id: Date.now(), name: trimmedValue, completed: false },
        ]);

        // 定番リストにあれば「追加済み」に更新
        setFrequentItems(prevFrequentItems =>
            prevFrequentItems.map(item =>
                item.name === trimmedValue ? { ...item, isAdded: true } : item,
            ),
        );

        return null;
    };

    const addFrequentItem = (inputValue: string) => {
        const trimmedValue = inputValue.trim();

        if (frequentItems.some(item => item.name === trimmedValue)) {
            return '登録済です。';
        }

        // 既に直近の買い物リストに存在するかチェック
        const isAlreadyInCurrentList = currentItems.some(
            item => item.name === trimmedValue,
        );

        setFrequentItems([
            ...frequentItems,
            {
                id: Date.now(),
                name: trimmedValue,
                completed: false,
                isAdded: isAlreadyInCurrentList,
            },
        ]);

        return null;
    };

    const toggleCurrentItem = (id: number) => {
        setCurrentItems(
            currentItems.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item,
            ),
        );
    };

    const deleteCurrentItem = (id: number) => {
        const deletedItem = currentItems.find(item => item.id === id);
        setCurrentItems(currentItems.filter(item => item.id !== id));

        if (deletedItem) {
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

    const addToCurrentFromFrequent = (id: number) => {
        const itemToAdd = frequentItems.find(item => item.id === id);
        if (itemToAdd && !itemToAdd.isAdded) {
            addCurrentItem(itemToAdd.name);
            setFrequentItems(
                frequentItems.map(item =>
                    item.id === id ? { ...item, isAdded: true } : item,
                ),
            );
        }
    };

    const reorderCurrentItems = (newOrder: Item[]) => {
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
                addCurrentItem,
                addFrequentItem,
                toggleCurrentItem,
                deleteCurrentItem,
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
