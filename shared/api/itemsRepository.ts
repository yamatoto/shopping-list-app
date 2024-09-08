import {
    collection,
    query,
    orderBy,
    getDocs,
    where,
    addDoc,
    doc,
    updateDoc,
    // deleteDoc,
    QueryDocumentSnapshot,
    onSnapshot,
    Timestamp,
    DocumentChange,
} from 'firebase/firestore';

import {
    ApiResponseItem,
    DisplayItem,
    ItemBase,
} from '@/features/shopping-list/models/itemModel';
import { db } from '@/shared/config/firabase';

const collectionName = 'items';

export const setupItemListener = (
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

export const fetchAllItems = async (): Promise<
    QueryDocumentSnapshot<ApiResponseItem>[]
> => {
    const q = query(
        collection(db, collectionName),
        orderBy('updatedAt', 'desc'),
    );
    const { docs } = await getDocs(q);
    return docs as QueryDocumentSnapshot<ApiResponseItem>[];
};

export const addItem = async (
    newItem: ItemBase,
    message: string,
): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        ...newItem,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        message,
    });
};

export const updateItem = async (
    updateItem: Partial<DisplayItem> & { id: string },
    message: string,
): Promise<void> => {
    const { id, ...rest } = updateItem;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...rest,
        updatedAt: Timestamp.now(),
        message,
    });
};

// export const deleteItem = async (id: string): Promise<void> => {
//     const docRef = doc(db, collectionName, id);
//     await deleteDoc(docRef);
// };
