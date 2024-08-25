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

import { FrequentItem, FrequentItemBase, ItemBase } from '@/models/item';
import { ServerCreateBase, ServerResponseBase } from '@/models/base';
import { db } from '@/config/firabase';

const collectionName = 'frequent-items';

type ServerFrequentItem = FrequentItemBase & ItemBase & ServerResponseBase;

const convertToClientItemFromServer = (
    docSnapshot: QueryDocumentSnapshot<DocumentData>,
): FrequentItem => {
    const data = docSnapshot.data() as ServerFrequentItem;
    return {
        id: docSnapshot.id,
        name: data.name,
        sortOrder: data.sortOrder,
        isAddedToCurrent: data.isAddedToCurrent,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    };
};

const generateCreateItem = ({
    name,
    sortOrder,
    isAddedToCurrent,
    userEmail,
}: {
    name: string;
    sortOrder: number;
    isAddedToCurrent: boolean;
    userEmail: string;
}): FrequentItemBase & ItemBase & ServerCreateBase => {
    return {
        name,
        sortOrder,
        isAddedToCurrent,
        createdBy: userEmail,
        updatedBy: userEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
};

const convertToClientItemFromAddResult = (
    docRef: DocumentReference<DocumentData>,
    newItem: FrequentItemBase & ItemBase & ServerCreateBase,
): FrequentItem => {
    const currentDate = new Date(); // クライアント側の現在時刻
    return {
        id: docRef.id,
        ...newItem,
        createdAt: currentDate,
        updatedAt: currentDate,
    };
};

const generateUpdateItem = (
    frequentItem: Omit<FrequentItem, 'id'>,
    userEmail: string,
): Omit<FrequentItemBase & ItemBase & ServerCreateBase, 'id' | 'createdAt'> => {
    const {
        updatedBy: _,
        createdAt: __,
        updatedAt: ___,
        ...updateBody
    } = frequentItem;
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

export const fetchAllItems = async (): Promise<FrequentItem[]> => {
    console.log('FrequentItems api fetchAllItems');
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
): Promise<FrequentItem | null> => {
    console.log('FrequentItems api findItemByName');
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

export const fetchLatestItem = async (): Promise<FrequentItem | null> => {
    console.log('FrequentItems api fetchLatestItem');
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
    isAddedToCurrent: boolean;
    userEmail: string;
}): Promise<FrequentItem> => {
    console.log(
        `FrequentItems api addItem: ${params.name} ${params.isAddedToCurrent}`,
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
    frequentItem: FrequentItem,
    userEmail: string,
): Promise<FrequentItem> => {
    console.log(
        `FrequentItems api updateItem: ${JSON.stringify(frequentItem)}`,
    );
    const { id, ...rest } = frequentItem;
    const updateItemData = generateUpdateItem(rest, userEmail);

    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, updateItemData);
        return { ...updateItemData, id, updatedAt: new Date() } as FrequentItem;
    } catch (error: any) {
        handleError(error, 'updateItem');
    }
};

export const deleteItem = async (id: string): Promise<void> => {
    console.log('FrequentItems api deleteItem');
    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    } catch (error: any) {
        handleError(error, 'deleteItem');
    }
};

export const batchUpdateItems = async (
    updates: ({ id: string } & Partial<FrequentItem>)[],
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
