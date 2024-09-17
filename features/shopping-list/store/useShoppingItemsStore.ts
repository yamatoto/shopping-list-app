import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseItem } from '@/shared/models/itemModel';
import { CATEGORIES } from '@/features/shopping-list/constants/category';

type ShoppingItemsStore = {
    resultOfFetchAllItems: QueryDocumentSnapshot<ApiResponseItem>[];
    setResultOfFetchAllItems: (
        apiItems: QueryDocumentSnapshot<ApiResponseItem>[],
    ) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    openSections: { [p: string]: boolean };
    setOpenSections: (
        updater: (prevState: { [p: string]: boolean }) => {
            [p: string]: boolean;
        },
    ) => void;
};

export const useShoppingItemsStore = create<ShoppingItemsStore>(set => ({
    resultOfFetchAllItems: [],
    setResultOfFetchAllItems: apiItems => {
        set({ resultOfFetchAllItems: apiItems });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
    openSections: CATEGORIES.reduce(
        (acc, category) => {
            acc[category] = true;
            return acc;
        },
        {} as { [key: string]: boolean },
    ),
    setOpenSections: updater => {
        set(state => ({
            openSections: updater(state.openSections),
        }));
    },
}));
