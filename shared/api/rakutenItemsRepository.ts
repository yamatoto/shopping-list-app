import {
    collection,
    getDocs,
    orderBy,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';

import { BaseRepository } from '@/shared/api/baseRepository';
import { ApiResponseItem, ItemBase } from '@/shared/models/itemModel';

export class RakutenItemsRepository extends BaseRepository<
    ApiResponseItem,
    ItemBase
> {
    constructor() {
        super('rakuten-items', '楽天アーカイブ買い物リスト');
    }

    async fetchArchiveItems(): Promise<
        QueryDocumentSnapshot<ApiResponseItem>[]
    > {
        const q = query(
            collection(this.db, this.collectionName),
            where('isCurrent', '==', false),
            where('isFrequent', '==', false),
            orderBy('updatedAt', 'desc'),
        );
        const { docs } = await getDocs(q);
        return docs as QueryDocumentSnapshot<ApiResponseItem>[];
    }
}
