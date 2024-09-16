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
    ApiResponseBugReport,
    BugReportBase,
    DisplayBugReport,
} from '@/features/configure/bugReport/models/bugReportModel';

const collectionName = 'bug-reports';

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
                message: `バグ報告の「${response.content}」が削除されました`,
            },
        }[change.type];
    };

export const setupBugReportListener = (
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

export const fetchAllBugReports = async (): Promise<
    QueryDocumentSnapshot<ApiResponseBugReport>[]
> => {
    const q = query(
        collection(db, collectionName),
        orderBy('priority', 'asc'),
        orderBy('updatedAt', 'desc'),
    );
    const { docs } = await getDocs(q);
    return docs as QueryDocumentSnapshot<ApiResponseBugReport>[];
};

export const addBugReport = async (
    newBugReport: BugReportBase,
    message: string,
): Promise<void> => {
    await addDoc(collection(db, collectionName), {
        ...newBugReport,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        message,
    });
};

export const updateBugReport = async (
    updateBugReport: Partial<DisplayBugReport> & { id: string },
    message: string,
): Promise<void> => {
    const { id, ...rest } = updateBugReport;
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...rest,
        updatedAt: Timestamp.now(),
        message,
    });
};
