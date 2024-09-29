import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { SCREEN } from '@/features/shopping-list/constants/screen';
import { ApiResponseItem } from '@/shared/models/itemModel';
import { ItemsRepository } from '@/shared/api/itemsRepository';
import { ShoppingList } from '@/features/shopping-list/usecases/useShoppingList';

export class CurrentShoppingList extends ShoppingList {
    constructor() {
        super(new ItemsRepository(), SCREEN.CURRENT);
    }

    isDuplicate(
        fetchedItem: QueryDocumentSnapshot<ApiResponseItem, DocumentData>,
    ): boolean {
        const { isCurrent } = fetchedItem.data();
        return isCurrent;
    }

    generateUpdateParams(registeredItem: {
        isCurrent: boolean;
        isFrequent: boolean;
    }) {
        return {
            isCurrent: true,
            isFrequent: registeredItem.isFrequent,
        };
    }

    generateAddParams() {
        return {
            isCurrent: true,
            isFrequent: false,
        };
    }
}
