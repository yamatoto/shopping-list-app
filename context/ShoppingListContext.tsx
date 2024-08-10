import React, { createContext, useState, useContext, ReactNode } from 'react';

import { FrequentItem, Item } from '@/models/item';

interface ShoppingListContextType {
    currentItems: Item[];
    frequentItems: FrequentItem[];
    addCurrentItem: (text: string) => void;
    addFrequentItem: (text: string) => void;
    toggleCurrentItem: (id: number) => void;
    deleteCurrentItem: (id: number) => void;
    addToCurrentFromFrequent: (id: number) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
    undefined,
);

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentItems, setCurrentItems] = useState<Item[]>([]);
    const [frequentItems, setFrequentItems] = useState<FrequentItem[]>([]);

    const addCurrentItem = (text: string) => {
        setCurrentItems([
            ...currentItems,
            { id: Date.now(), text, completed: false },
        ]);
    };

    const addFrequentItem = (text: string) => {
        setFrequentItems([
            ...frequentItems,
            { id: Date.now(), text, completed: false, isAdded: false },
        ]);
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
                    if (item.text === deletedItem.text) {
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
            addCurrentItem(itemToAdd.text);
            setFrequentItems(
                frequentItems.map(item =>
                    item.id === id ? { ...item, isAdded: true } : item,
                ),
            );
        }
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
