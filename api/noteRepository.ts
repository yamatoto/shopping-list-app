import {
    serverTimestamp,
    collection,
    query,
    getDocs,
    doc,
    updateDoc,
    QueryDocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';

import { Note, NoteBase } from '@/models/note';
import { ServerCreateBase, ServerResponseBase } from '@/models/base';
import { db } from '@/config/firabase';

const collectionName = 'note';

type ServerNote = Note & ServerResponseBase;

const convertToClientItemFromServer = (
    docSnapshot: QueryDocumentSnapshot<DocumentData>,
): Note => {
    const data = docSnapshot.data() as ServerNote;
    return {
        ...data,
        id: docSnapshot.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    };
};

const generateUpdateItem = (
    note: Omit<Note, 'id'>,
    userEmail: string,
): Omit<NoteBase & ServerCreateBase, 'id' | 'createdAt'> => {
    const { updatedBy: _, createdAt: __, updatedAt: ___, ...updateBody } = note;
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

export const fetchNoteList = async (): Promise<Note[]> => {
    try {
        const q = query(collection(db, collectionName));
        const { docs } = await getDocs(q);
        return docs.map(convertToClientItemFromServer);
    } catch (error: any) {
        handleError(error, 'fetchNote');
    }
};

export const updateNote = async (
    currentNote: Note,
    userEmail: string,
): Promise<Note> => {
    const { id, ...rest } = currentNote;
    const updateItemData = generateUpdateItem(rest, userEmail);

    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, updateItemData);
        return { ...updateItemData, id, updatedAt: new Date() } as Note;
    } catch (error: any) {
        handleError(error, 'updateNote');
    }
};
