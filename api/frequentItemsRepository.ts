import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { FrequentItem, FrequentItemBase, ItemBase } from '@/models/item';
import { ServerCreateBase, ServerResponseBase } from '@/models/base';

const collectionName = 'frequent-items';

type ServerFrequentItem = FrequentItemBase & ItemBase & ServerResponseBase;

const convertToClientItemFromServer = (
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
): FrequentItem => {
    const data = doc.data() as ServerFrequentItem;
    return {
        id: doc.id,
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
    const serverTimestamp = firestore.FieldValue.serverTimestamp();
    return {
        name,
        sortOrder,
        isAddedToCurrent,
        createdBy: userEmail,
        updatedBy: userEmail,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
    };
};

const convertToClientItemFromAddResult = (
    docRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
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
        updatedAt: firestore.FieldValue.serverTimestamp(),
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
        const { docs } = await firestore()
            .collection(collectionName)
            .orderBy('sortOrder', 'asc')
            .get();
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
        const { docs } = await firestore()
            .collection<FirebaseFirestoreTypes.DocumentData>(collectionName)
            .where('name', '==', name)
            .get();
        if (docs.length === 0) return null;

        return convertToClientItemFromServer(docs[0]);
    } catch (error: any) {
        handleError(error, 'findItemByName');
    }
};

export const fetchLatestItem = async (): Promise<FrequentItem | null> => {
    console.log('FrequentItems api fetchLatestItem');
    try {
        const { docs } = await firestore()
            .collection<FirebaseFirestoreTypes.DocumentData>(collectionName)
            .orderBy('sortOrder', 'asc')
            .limit(1)
            .get();
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
        const docRef = await firestore()
            .collection(collectionName)
            .add(newItem);
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
    const updateItem = generateUpdateItem(rest, userEmail);

    try {
        await firestore().collection(collectionName).doc(id).update(updateItem);
        return { ...updateItem, id, updatedAt: new Date() } as FrequentItem;
    } catch (error: any) {
        handleError(error, 'updateItem');
    }
};

export const deleteItem = async (id: string): Promise<void> => {
    console.log('FrequentItems api deleteItem');
    try {
        await firestore().collection(collectionName).doc(id).delete();
    } catch (error: any) {
        handleError(error, 'deleteItem');
    }
};

export const batchUpdateItems = async (
    updates: ({ id: string } & Partial<FrequentItem>)[],
) => {
    try {
        const batch = firestore().batch();
        updates.forEach(update => {
            const { id, ...updateData } = update;
            const docRef = firestore().collection(collectionName).doc(id);
            batch.update(docRef, updateData);
        });
        await batch.commit();
    } catch (error: any) {
        handleError(error, 'batchUpdateItems');
    }
};
