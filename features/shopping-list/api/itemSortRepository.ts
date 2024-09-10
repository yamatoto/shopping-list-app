import {
    collection,
    query,
    getDocs,
    doc,
    updateDoc,
    QueryDocumentSnapshot,
    Timestamp,
    onSnapshot,
    where,
    DocumentChange,
    addDoc,
} from 'firebase/firestore';

import { db } from '@/shared/config/firabase';
import { ApiResponseItemSort } from '@/features/shopping-list/models/itemSortModel';

const collectionName = 'item-sort';

export const setupItemSortListener = (
    onChange: (change: DocumentChange) => void,
) => {
    const now = Date.now();
    const collectionRef = query(
        collection(db, collectionName),
        where('updatedAt', '>=', Timestamp.fromMillis(now)),
    );

    return onSnapshot(
        collectionRef,
        { includeMetadataChanges: false },
        snapshot => {
            snapshot.docChanges().forEach(change => {
                onChange(change);
            });
        },
    );
};

export const fetchItemSortList = async (): Promise<
    QueryDocumentSnapshot<ApiResponseItemSort>[]
> => {
    const q = query(collection(db, collectionName));
    const { docs } = await getDocs(q);
    return docs as QueryDocumentSnapshot<ApiResponseItemSort>[];
};

export const updateItemSort = async (
    id: string,
    updatedUser: string,
    itemList: string[],
): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        itemList,
        updatedUser,
        updatedAt: Timestamp.now(),
    });
};

export const addItemSort = async (itemList: string[]): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        itemList,
        itemType: 'current',
        updatedUser: 'mftb35ymt@yahoo.co.jp',
        updatedAt: Timestamp.now(),
    });
    await addDoc(collection(db, collectionName), {
        itemList,
        itemType: 'frequent',
        updatedUser: 'mftb35ymt@yahoo.co.jp',
        updatedAt: Timestamp.now(),
    });
};
