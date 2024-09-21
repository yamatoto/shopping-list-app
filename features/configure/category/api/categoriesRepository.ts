import {
    collection,
    query,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    QueryDocumentSnapshot,
    onSnapshot,
    Timestamp,
    DocumentChange,
    deleteDoc,
    where,
} from 'firebase/firestore';

import { db } from '@/shared/config/firabase';
import {
    ApiResponseCategory,
    CategoryBase,
    DisplayCategory,
} from '@/features/configure/category/models/categoryModel';

const collectionName = 'categories';

const createHandleDocChange =
    (now: number) =>
    (
        change: DocumentChange,
    ): { updatedUserName: string; message?: string } | null => {
        const response = change.doc.data();
        return {
            added:
                response.updatedAt > Timestamp.fromMillis(now)
                    ? {
                          updatedUserName: `${response.updatedUserName}が`,
                          message: response.message,
                      }
                    : null,
            modified: {
                updatedUserName: `${response.updatedUserName}が`,
                message: response.message,
            },
            removed: {
                updatedUserName: '',
                message: `カテゴリーの「${response.name}」が削除されました`,
            },
        }[change.type];
    };

export const setupCategoryListener = (
    onChange: (change: { message?: string; updatedUserName: string }) => void,
) => {
    const collectionRef = query(collection(db, collectionName));
    const handleDocChange = createHandleDocChange(Date.now());

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

export const fetchAllCategories = async (): Promise<
    QueryDocumentSnapshot<ApiResponseCategory>[]
> => {
    const { docs } = await getDocs(collection(db, collectionName));
    return docs as QueryDocumentSnapshot<ApiResponseCategory>[];
};

export const findCategoryByName = async (
    name: string,
): Promise<QueryDocumentSnapshot<ApiResponseCategory> | null> => {
    const q = query(collection(db, collectionName), where('name', '==', name));
    const { docs } = await getDocs(q);
    if (docs.length === 0) return null;
    return docs[0] as QueryDocumentSnapshot<ApiResponseCategory>;
};

export const addCategory = async (
    newCategory: CategoryBase,
    message: string,
): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        ...newCategory,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        message,
    });
};

export const updateCategory = async (
    updateCategory: Partial<DisplayCategory> & { id: string },
    message: string,
): Promise<void> => {
    const { id, ...rest } = updateCategory;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...rest,
        updatedAt: Timestamp.now(),
        message,
    });
};
export const deleteCategory = async (id: string): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};
