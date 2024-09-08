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
    DocumentChange,
} from 'firebase/firestore';

import { ApiResponseNote } from '@/features/note/models/noteModel';
import { db } from '@/shared/config/firabase';

const collectionName = 'note';

export const setupNoteListener = (
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
