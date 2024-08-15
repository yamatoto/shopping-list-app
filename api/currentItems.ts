import firestore from '@react-native-firebase/firestore';

import { CurrentItem } from '@/models/item';

const collectionName = 'current-items';

export const fetchAllCurrentItems = async (): Promise<CurrentItem[]> => {
    console.log('api fetchAllCurrentItems');
    try {
        const { docs } = await firestore().collection(collectionName).get();
        return docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                isAddedToFrequent: data.isAddedToFrequent,
                completed: data.completed,
                createdBy: data.createdBy,
                updatedBy: data.updatedBy,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            };
        });
    } catch (error: any) {
        console.error(`fetchAllCurrentItemsでエラー. ${error}`);
        throw new Error(error);
    }
};

export const addCurrentItem = async (
    name: string,
    isAddedToFrequent: boolean,
    userEmail: string,
): Promise<CurrentItem> => {
    console.log(`api addCurrentItem: ${name} ${isAddedToFrequent}`);
    const serverTimestamp = firestore.FieldValue.serverTimestamp();
    const newItem = {
        name,
        isAddedToFrequent,
        completed: false,
        createdBy: userEmail,
        updatedBy: userEmail,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
    };

    try {
        const docRef = await firestore()
            .collection(collectionName)
            .add(newItem);

        const currentDate = new Date(); // クライアント側の現在時刻
        return {
            id: docRef.id,
            ...newItem,
            createdAt: currentDate,
            updatedAt: currentDate,
        } as CurrentItem;
    } catch (error: any) {
        console.error(`addCurrentItemでエラー. ${error}`);
        throw new Error(error);
    }
};

export const updateCurrentItem = async (
    currentItem: CurrentItem,
    userEmail: string,
): Promise<CurrentItem> => {
    console.log(`api updateCurrentItem: ${JSON.stringify(currentItem)}`);
    const {
        id,
        updatedBy: _,
        createdAt: __,
        updatedAt: ___,
        ...updateBody
    } = currentItem;

    try {
        await firestore()
            .collection(collectionName)
            .doc(id)
            .update({
                ...updateBody,
                updatedBy: userEmail,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });

        return {
            id,
            ...updateBody,
            updatedBy: userEmail,
            updatedAt: new Date(),
        } as CurrentItem;
    } catch (error: any) {
        console.error(`updateCurrentItemでエラー. ${error}`);
        throw new Error(error);
    }
};

export const deleteCurrentItem = async (id: string): Promise<void> => {
    try {
        await firestore().collection(collectionName).doc(id).delete();
    } catch (error: any) {
        console.error(`deleteCurrentItemでエラー. ${error}`);
        throw new Error(error);
    }
};
