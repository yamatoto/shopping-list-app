import {
    collection,
    query,
    orderBy,
    getDocs,
    where,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    QueryDocumentSnapshot,
    onSnapshot,
    Timestamp,
    DocumentChange,
} from 'firebase/firestore';

import {
    ApiResponseItem,
    DisplayItem,
    ItemBase,
} from '@/shared/models/itemModel';
import { db } from '@/shared/config/firabase';

const collectionName = 'items';

const createHandleDocChange =
    (now: number) =>
    (
        change: DocumentChange,
    ): { updatedUser: string; message?: string } | null => {
        const response = change.doc.data();
        return {
            added:
                response.updatedAt > Timestamp.fromMillis(now)
                    ? {
                          updatedUser: `${response.updatedUser}が`,
                          message: response.message,
                      }
                    : null,
            modified: {
                updatedUser: `${response.updatedUser}が`,
                message: response.message,
            },
            removed: {
                updatedUser: '',
                message: `「${response.name}」がアーカイブから削除されました`,
            },
        }[change.type];
    };

export const setupItemListener = (
    onChange: (change: { message?: string; updatedUser: string }) => void,
) => {
    const collectionRef = query(collection(db, collectionName));
    const handleDocChange = createHandleDocChange(Date.now());

    return onSnapshot(
        collectionRef,
        { includeMetadataChanges: false },
        snapshot => {
            snapshot.docChanges().forEach(change => {
                const changeData = handleDocChange(change);
                if (changeData) {
                    onChange(changeData);
                }
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

export const fetchArchiveItems = async (): Promise<
    QueryDocumentSnapshot<ApiResponseItem>[]
> => {
    const q = query(
        collection(db, collectionName),
        where('isCurrent', '==', false),
        where('isFrequent', '==', false),
        orderBy('updatedAt', 'desc'),
    );
    const { docs } = await getDocs(q);
    return docs as QueryDocumentSnapshot<ApiResponseItem>[];
};

export const findItemByName = async (
    name: string,
): Promise<QueryDocumentSnapshot<ApiResponseItem> | null> => {
    const q = query(collection(db, collectionName), where('name', '==', name));
    const { docs } = await getDocs(q);
    if (docs.length === 0) return null;
    return docs[0] as QueryDocumentSnapshot<ApiResponseItem>;
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

export const deleteItem = async (id: string): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};
