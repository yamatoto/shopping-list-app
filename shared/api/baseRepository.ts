import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentChange,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';

import { db } from '@/shared/config/firabase';

export class BaseRepository<T, E> {
    protected readonly collectionName: string;
    protected readonly deleteMessage: string;
    protected readonly now = Date.now();
    protected readonly db = db;

    constructor(collectionName: string, deleteMessage: string) {
        this.collectionName = collectionName;
        this.deleteMessage = deleteMessage;
    }

    private createHandleDocChange() {
        return (
            change: DocumentChange,
        ): { updatedUser: string; message?: string } | null => {
            const response = change.doc.data();
            return {
                added:
                    response.updatedAt > Timestamp.fromMillis(this.now)
                        ? {
                              updatedUser: `${response.updatedUser}が`,
                              message: response.message,
                          }
                        : null,
                modified: {
                    updatedUser: `${response.updatedUser}が`,
                    message: response.message,
                },
                removed: {
                    updatedUser: '',
                    message: `「${response.name}」が${this.deleteMessage}から削除されました`,
                },
            }[change.type];
        };
    }

    setupUpdateListener = (
        onChange: (change: { message?: string; updatedUser: string }) => void,
    ) => {
        const collectionRef = query(collection(db, this.collectionName));
        const handleDocChange = this.createHandleDocChange();

        return onSnapshot(
            collectionRef,
            { includeMetadataChanges: false },
            snapshot => {
                snapshot.docChanges().forEach(change => {
                    const changeData = handleDocChange(change);
                    if (changeData) {
                        onChange(changeData);
                    }
                });
            },
        );
    };

    async fetchAll(): Promise<QueryDocumentSnapshot<T>[]> {
        const q = query(
            collection(db, this.collectionName),
            orderBy('updatedAt', 'desc'),
        );
        const { docs } = await getDocs(q);
        return docs as QueryDocumentSnapshot<T>[];
    }

    async findByName(name: string): Promise<QueryDocumentSnapshot<T> | null> {
        const q = query(
            collection(db, this.collectionName),
            where('name', '==', name),
        );
        const { docs } = await getDocs(q);
        if (docs.length === 0) return null;
        return docs[0] as QueryDocumentSnapshot<T>;
    }

    async add(newRecord: E, message?: string): Promise<void> {
        await addDoc(collection(db, this.collectionName), {
            ...newRecord,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            message,
        });
    }

    async update(
        updateRecord: Partial<E> & { id: string },
        message?: string,
    ): Promise<void> {
        const { id, ...rest } = updateRecord;
        const docRef = doc(db, this.collectionName, id);
        await updateDoc(docRef, {
            ...rest,
            updatedAt: Timestamp.now(),
            message,
        });
    }

    async delete(id: string): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
    }
}
