import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { CurrentItem, CurrentItemBase, ItemBase } from '@/models/item';
import { ServerCreateBase, ServerResponseBase } from '@/models/base';

const collectionName = 'current-items';

type ServerCurrentItem = CurrentItemBase & ItemBase & ServerResponseBase;

const convertToClientItemFromServer = (
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
): CurrentItem => {
    const data = doc.data() as ServerCurrentItem;
    return {
        id: doc.id,
        name: data.name,
        sortOrder: data.sortOrder,
        isAddedToFrequent: data.isAddedToFrequent,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
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
    const serverTimestamp = firestore.FieldValue.serverTimestamp();
    return {
        name,
        sortOrder,
        isAddedToFrequent,
        createdBy: userEmail,
        updatedBy: userEmail,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
    };
};

const convertToClientItemFromAddResult = (
    docRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
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
        updatedAt: firestore.FieldValue.serverTimestamp(),
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
): Promise<CurrentItem | null> => {
    console.log('CurrentItems api findItemByName');
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

export const fetchLatestItem = async (): Promise<CurrentItem | null> => {
    console.log('CurrentItems api fetchLatestItem');
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
    isAddedToFrequent: boolean;
    userEmail: string;
}): Promise<CurrentItem> => {
    console.log(
        `CurrentItems api addItem: ${params.name} ${params.isAddedToFrequent}`,
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
    currentItem: CurrentItem,
    userEmail: string,
): Promise<CurrentItem> => {
    console.log(`CurrentItems api updateItem: ${JSON.stringify(currentItem)}`);
    const { id, ...rest } = currentItem;
    const updateItem = generateUpdateItem(rest, userEmail);

    try {
        await firestore().collection(collectionName).doc(id).update(updateItem);
        return { ...updateItem, id, updatedAt: new Date() } as CurrentItem;
    } catch (error: any) {
        handleError(error, 'updateItem');
    }
};

export const deleteItem = async (id: string): Promise<void> => {
    console.log('CurrentItems api deleteItem');
    try {
        await firestore().collection(collectionName).doc(id).delete();
    } catch (error: any) {
        handleError(error, 'deleteItem');
    }
};

export const batchUpdateItems = async (
    updates: ({ id: string } & Partial<CurrentItem>)[],
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
