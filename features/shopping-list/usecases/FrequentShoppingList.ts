import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import { SCREEN } from '@/features/shopping-list/constants/screen';
import { ApiResponseItem } from '@/shared/models/itemModel';
import { ItemsRepository } from '@/shared/api/itemsRepository';
import { ShoppingList } from '@/features/shopping-list/usecases/useShoppingList';

export class FrequentShoppingList extends ShoppingList {
    constructor() {
        super(new ItemsRepository(), SCREEN.CURRENT);
    }

    isDuplicate(
        fetchedItem: QueryDocumentSnapshot<ApiResponseItem, DocumentData>,
    ): boolean {
        const { isFrequent } = fetchedItem.data();
        return isFrequent;
    }

    generateUpdateParams(registeredItem: {
        isCurrent: boolean;
        isFrequent: boolean;
    }) {
        return {
            isCurrent: registeredItem.isCurrent,
            isFrequent: true,
        };
    }

    generateAddParams() {
        return {
            isCurrent: false,
            isFrequent: true,
        };
    }
}
