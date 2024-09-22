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
} from 'firebase/firestore';

import { db } from '@/shared/config/firabase';
import {
    ApiResponseCategorySort,
    CategorySortBase,
} from '@/shared/models/categorySortModel';

const collectionName = 'category-sort';

export const setupCategorySortListener = (
    onChange: (change: { message?: string; updatedUserName: string }) => void,
) => {
    const collectionRef = query(collection(db, collectionName));

    return onSnapshot(
        collectionRef,
        { includeMetadataChanges: false },
        snapshot => {
            snapshot.docChanges().forEach(change => {
                const response = change.doc.data();
                if (change.type === 'modified') {
                    onChange({
                        updatedUserName: `${response.updatedUserName}が`,
                        message: response.message,
                    });
                }
            });
        },
    );
};

export const fetchCategorySort = async (): Promise<
    QueryDocumentSnapshot<ApiResponseCategorySort>
> => {
    const { docs } = await getDocs(collection(db, collectionName));
    return docs[0] as QueryDocumentSnapshot<ApiResponseCategorySort>;
};

export const addCategorySort = async (
    categories: { id: string; name: string }[],
): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        categories,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
};

export const updateCategory = async (
    id: string,
    categorySort: CategorySortBase,
    message: string,
): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...categorySort,
        updatedAt: Timestamp.now(),
        message,
    });
};
