import {
    serverTimestamp,
    collection,
    query,
    orderBy,
    getDocs,
    where,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
    limit,
    QueryDocumentSnapshot,
    DocumentReference,
    DocumentData,
} from 'firebase/firestore';

import { CurrentItem, CurrentItemBase, ItemBase } from '@/models/item';
import { ServerCreateBase, ServerResponseBase } from '@/models/base';
import { db } from '@/config/firabase';
const collectionName = 'current-items';

type ServerCurrentItem = CurrentItemBase & ItemBase & ServerResponseBase;

const convertToClientItemFromServer = (
    docSnapshot: QueryDocumentSnapshot<DocumentData>,
): CurrentItem => {
    const data = docSnapshot.data() as ServerCurrentItem;
    return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    };
};

const generateCreateItem = ({
    name,
    sortOrder,
    isAddedToFrequent,
    userEmail,
}: {
    name: string;
    sortOrder: number;
    isAddedToFrequent: boolean;
    userEmail: string;
}): CurrentItemBase & ItemBase & ServerCreateBase => {
    return {
        name,
        sortOrder,
        isAddedToFrequent,
        quantity: 1,
        createdBy: userEmail,
        updatedBy: userEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
};

const convertToClientItemFromAddResult = (
    docRef: DocumentReference<DocumentData>,
    newItem: CurrentItemBase & ItemBase & ServerCreateBase,
): CurrentItem => {
    const currentDate = new Date(); // クライアント側の現在時刻
    return {
        id: docRef.id,
        ...newItem,
        createdAt: currentDate,
        updatedAt: currentDate,
    };
};

const generateUpdateItem = (
    currentItem: Omit<CurrentItem, 'id'>,
    userEmail: string,
): Omit<CurrentItemBase & ItemBase & ServerCreateBase, 'id' | 'createdAt'> => {
    const {
        updatedBy: _,
        createdAt: __,
        updatedAt: ___,
        ...updateBody
    } = currentItem;
    return {
        ...updateBody,
        updatedBy: userEmail,
        updatedAt: serverTimestamp(),
    };
};

function handleError(error: any, functionName: string): never {
    console.error(
        `${collectionName} repository ${functionName} failed: ${error}`,
    );
    throw new Error(error);
}

export const fetchAllItems = async (): Promise<CurrentItem[]> => {
    console.log('CurrentItems api fetchAllItems');

    try {
        const q = query(
            collection(db, collectionName),
            orderBy('sortOrder', 'asc'),
        );
        const { docs } = await getDocs(q);
        return docs.map(convertToClientItemFromServer);
    } catch (error: any) {
        handleError(error, 'fetchAllItems');
    }
};

export const findItemByName = async (
    name: string,
): Promise<CurrentItem | null> => {
    console.log('CurrentItems api findItemByName');
    try {
        const q = query(
            collection(db, collectionName),
            where('name', '==', name),
        );
        const { docs } = await getDocs(q);
        if (docs.length === 0) return null;

        return convertToClientItemFromServer(docs[0]);
    } catch (error: any) {
        handleError(error, 'findItemByName');
    }
};

export const fetchLatestItem = async (): Promise<CurrentItem | null> => {
    console.log('CurrentItems api fetchLatestItem');
    try {
        const q = query(
            collection(db, collectionName),
            orderBy('sortOrder', 'asc'),
            limit(1),
        );
        const { docs } = await getDocs(q);
        if (docs.length === 0) return null;
        return convertToClientItemFromServer(docs[0]);
    } catch (error: any) {
        handleError(error, 'fetchLatestItem');
    }
};

export const addItem = async (params: {
    name: string;
    sortOrder: number;
    isAddedToFrequent: boolean;
    userEmail: string;
}): Promise<CurrentItem> => {
    console.log(
        `CurrentItems api addItem: ${params.name} ${params.isAddedToFrequent}`,
    );
    const newItem = generateCreateItem(params);

    try {
        const docRef = await addDoc(collection(db, collectionName), newItem);
        return convertToClientItemFromAddResult(docRef, newItem);
    } catch (error: any) {
        handleError(error, 'addItem');
    }
};

export const updateItem = async (
    currentItem: CurrentItem,
    userEmail: string,
): Promise<CurrentItem> => {
    console.log(`CurrentItems api updateItem: ${JSON.stringify(currentItem)}`);
    const { id, ...rest } = currentItem;
    const updateItemData = generateUpdateItem(rest, userEmail);

    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, updateItemData);
        return { ...updateItemData, id, updatedAt: new Date() } as CurrentItem;
    } catch (error: any) {
        handleError(error, 'updateItem');
    }
};

export const deleteItem = async (id: string): Promise<void> => {
    console.log('CurrentItems api deleteItem');
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    } catch (error: any) {
        handleError(error, 'deleteItem');
    }
};

export const batchUpdateItems = async (
    updates: ({ id: string } & Partial<CurrentItem>)[],
) => {
    try {
        const batch = writeBatch(db);
        updates.forEach(update => {
            const { id, ...updateData } = update;
            const docRef = doc(db, collectionName, id);
            batch.update(docRef, updateData);
        });
        await batch.commit();
    } catch (error: any) {
        handleError(error, 'batchUpdateItems');
    }
};
