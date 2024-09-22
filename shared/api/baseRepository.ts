import {
    addDoc,
    collection,
    deleteDoc,
    deleteField,
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
    writeBatch,
} from 'firebase/firestore';

import { db } from '@/shared/config/firabase';

type ChangeMessageContent = {
    updatedUser: string;
    message?: string;
    userName?: string;
};
export class BaseRepository<T, E> {
    protected readonly collectionName: string;
    protected readonly deleteMessage: string;
    protected readonly now = Date.now();
    protected readonly db = db;

    constructor(collectionName: string, deleteMessage: string = '') {
        this.collectionName = collectionName;
        this.deleteMessage = deleteMessage;
    }

    private createHandleDocChange() {
        return (change: DocumentChange): ChangeMessageContent | null => {
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
                    userName: response.userName,
                    updatedUser: `${response.updatedUser}が`,
                    message: response.message,
                },
                removed: {
                    updatedUser: '',
                    message: `「${response.name ?? response.content}」が${this.deleteMessage}から削除されました`,
                },
            }[change.type];
        };
    }

    setupUpdateListener = (
        onChange: (change: ChangeMessageContent) => void,
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

    protected getOrderByFields(): {
        field: string;
        direction: 'asc' | 'desc';
    }[] {
        return [{ field: 'updatedAt', direction: 'desc' }];
    }

    async fetchAll(): Promise<QueryDocumentSnapshot<T>[]> {
        const orderByConditions = this.getOrderByFields().map(
            ({ field, direction }) => orderBy(field, direction),
        );

        const q = query(
            collection(db, this.collectionName),
            ...orderByConditions,
        );
        const { docs } = await getDocs(q);
        return docs as QueryDocumentSnapshot<T>[];
    }

    async fetchOne(): Promise<QueryDocumentSnapshot<T>> {
        const { docs } = await getDocs(collection(db, this.collectionName));
        return docs[0] as QueryDocumentSnapshot<T>;
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
            ...{ ...(message ? { message } : {}) },
        });
    }

    async delete(id: string): Promise<void> {
        const docRef = doc(db, this.collectionName, id);
        await deleteDoc(docRef);
    }

    async changeFieldName(
        oldFieldName: string,
        newFieldName: string,
    ): Promise<void> {
        const collectionName = this.collectionName;

        const colRef = collection(this.db, collectionName);
        const snapshot = await getDocs(colRef);

        const batch = writeBatch(this.db);

        snapshot.forEach(docSnapshot => {
            const docRef = doc(db, collectionName, docSnapshot.id);
            const data = docSnapshot.data();

            if (data[oldFieldName]) {
                batch.update(docRef, {
                    [newFieldName]: data[oldFieldName],
                    [oldFieldName]: deleteField(),
                });
            }
        });

        await batch.commit();
        console.log('フィールド名の変更が完了しました');
    }
}
