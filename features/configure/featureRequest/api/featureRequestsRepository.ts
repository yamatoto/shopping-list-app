import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    QueryDocumentSnapshot,
    onSnapshot,
    Timestamp,
    DocumentChange,
} from 'firebase/firestore';

import { db } from '@/shared/config/firabase';
import {
    ApiResponseFeatureRequest,
    FeatureRequestBase,
    DisplayFeatureRequest,
} from '@/features/configure/featureRequest/models/featureRequestModel';

const collectionName = 'feature-requests';

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
                message: `実装要望の「${response.content}」が削除されました`,
            },
        }[change.type];
    };

export const setupFeatureRequestListener = (
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

export const fetchAllFeatureRequests = async (): Promise<
    QueryDocumentSnapshot<ApiResponseFeatureRequest>[]
> => {
    const q = query(
        collection(db, collectionName),
        orderBy('priority', 'asc'),
        orderBy('updatedAt', 'desc'),
    );
    const { docs } = await getDocs(q);
    return docs as QueryDocumentSnapshot<ApiResponseFeatureRequest>[];
};

export const addFeatureRequest = async (
    newFeatureRequest: FeatureRequestBase,
    message: string,
): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        ...newFeatureRequest,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        message,
    });
};

export const updateFeatureRequest = async (
    updateFeatureRequest: Partial<DisplayFeatureRequest> & { id: string },
    message: string,
): Promise<void> => {
    const { id, ...rest } = updateFeatureRequest;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...rest,
        updatedAt: Timestamp.now(),
        message,
    });
};
