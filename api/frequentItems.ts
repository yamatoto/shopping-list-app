import firestore from '@react-native-firebase/firestore';

import { FrequentItem } from '@/models/item';

const collectionName = 'frequent-items';

export const fetchAllFrequentItems = async (): Promise<FrequentItem[]> => {
    try {
        console.log('api fetchAllFrequentItems');
        const { docs } = await firestore().collection(collectionName).get();
        return docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                isAdded: data.isAdded,
                createdBy: data.createdBy,
                updatedBy: data.updatedBy,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            };
        });
    } catch (error: any) {
        console.error(`fetchAllFrequentItemsでエラー. ${error}`);
        throw new Error(error);
    }
};

export const addFrequentItem = async (
    name: string,
    isAdded: boolean,
    userEmail: string,
): Promise<FrequentItem> => {
    console.log('api requentItem');
    const serverTimestamp = firestore.FieldValue.serverTimestamp();
    const newItem = {
        name,
        isAdded,
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
        } as FrequentItem;
    } catch (error: any) {
        console.error(`addFrequentItemでエラー. ${error}`);
        throw new Error(error);
    }
};

export const updateFrequentItem = async (
    frequentItem: FrequentItem,
    userEmail: string,
): Promise<FrequentItem> => {
    console.log('api teFrequentItem');
    const {
        id,
        updatedBy: _,
        createdAt: __,
        updatedAt: ___,
        ...updateBody
    } = frequentItem;

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
        } as FrequentItem;
    } catch (error: any) {
        console.error(`updateFrequentItemでエラー. ${error}`);
        throw new Error(error);
    }
};

export const deleteFrequentItem = async (id: string): Promise<void> => {
    console.log('api teFrequentItem');
    try {
        await firestore().collection(collectionName).doc(id).delete();
    } catch (error: any) {
        console.error(`deleteFrequentItemでエラー. ${error}`);
        throw new Error(error);
    }
};
