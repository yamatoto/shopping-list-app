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
} from 'firebase/firestore';
import Toast from 'react-native-simple-toast';

import { ApiResponseNote } from '@/models/noteModel';
import { db } from '@/config/firabase';

const collectionName = 'note';

const now = Date.now();
const collectionRef = query(
    collection(db, collectionName),
    where('updatedAt', '>=', Timestamp.fromMillis(now)),
);

onSnapshot(collectionRef, { includeMetadataChanges: false }, snapshot => {
    snapshot.docChanges().forEach(change => {
        const { userDisplayName } = change.doc.data();

        if (change.type === 'modified') {
            Toast.show(`${userDisplayName}のメモが更新されました。`, 300, {});
        }
    });
});

export const fetchNoteList = async (): Promise<
    QueryDocumentSnapshot<ApiResponseNote>[]
> => {
    const q = query(collection(db, collectionName));
    const { docs } = await getDocs(q);
    return docs as QueryDocumentSnapshot<ApiResponseNote>[];
};

export const updateNote = async (
    id: string,
    content: string,
): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        content,
        updatedAt: Timestamp.now(),
    });
};
