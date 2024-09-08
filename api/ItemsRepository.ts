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
} from 'firebase/firestore';
import Toast from 'react-native-simple-toast';

import { ApiResponseItem, ItemBase } from '@/models/itemModel';
import { db } from '@/config/firabase';

const collectionName = 'items';
const now = Date.now();
const collectionRef = query(
    collection(db, collectionName),
    where('updatedAt', '>=', Timestamp.fromMillis(now)),
);

onSnapshot(collectionRef, { includeMetadataChanges: false }, snapshot => {
    snapshot.docChanges().forEach(change => {
        const { name, isCurrent } = change.doc.data();

        if (change.type === 'added') {
            Toast.show(
                `${isCurrent ? '直近' : '定番'}の買い物リストに「${name}」が追加されました。`,
                300,
                {},
            );
        }

        // TODO: messageカラム追加する
        if (change.type === 'modified') {
            Toast.show(`買い物リストの「${name}」が更新されました。`, 300, {});
        }
        // if (change.type === 'removed') {
        //     Toast.show(`買い物リストの「${name}」が削除されました。`, 300, {});
        // }
    });
});

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

export const addItem = async (newItem: ItemBase): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        ...newItem,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const updateItem = async (
    updateItem: Partial<ItemBase> & { id: string },
): Promise<void> => {
    const docRef = doc(db, collectionName, updateItem.id);
    await updateDoc(docRef, {
        ...updateItem,
        updatedAt: Timestamp.now(),
    });
};

// export const deleteItem = async (id: string): Promise<void> => {
//     const docRef = doc(db, collectionName, id);
//     await deleteDoc(docRef);
// };
