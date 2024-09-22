import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import {
    ApiResponseNote,
    DisplayNote,
} from '@/features/configure/note/models/noteModel';
import { useNoteStore } from '@/features/configure/note/store/useNoteStore';
import { DEVELOPER_EMAIL } from '@/shared/config/user';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';

const MIN_TEXT_AREA_HEIGHT = 100;

export const useNoteQuery = () => {
    const { currentUser } = useFirebaseAuth();
    const {
        resultOfFetchNoteList,
        developerTextAreaHeight,
        inputtingText,
        isNoteChanged,
        refreshing,
    } = useNoteStore(
        ({
            resultOfFetchNoteList,
            developerTextAreaHeight,
            inputtingText,
            isNoteChanged,
            refreshing,
        }) => ({
            resultOfFetchNoteList,
            developerTextAreaHeight,
            inputtingText,
            isNoteChanged,
            refreshing,
        }),
    );

    const convertToClientNoteFromServer = (
        fetchedNote: QueryDocumentSnapshot<ApiResponseNote>,
    ): DisplayNote => {
        const data = fetchedNote.data();
        return {
            ...data,
            id: fetchedNote.id,
            updatedAt: data.updatedAt.toDate(),
        };
    };

    const { loginUsersNote, partnerNote, initialText } = useMemo(() => {
        const { loginUsersNote, partnerNote } = resultOfFetchNoteList.reduce<{
            loginUsersNote: DisplayNote;
            partnerNote: DisplayNote;
        }>(
            (acc, fetchedNote) => {
                const converted = convertToClientNoteFromServer(fetchedNote);
                const noteKey =
                    currentUser?.displayName === converted.userName
                        ? 'loginUsersNote'
                        : 'partnerNote';
                return {
                    ...acc,
                    [noteKey]: converted,
                };
            },
            {
                loginUsersNote: {} as DisplayNote,
                partnerNote: {} as DisplayNote,
            },
        );

        const initialText =
            currentUser?.email === DEVELOPER_EMAIL
                ? loginUsersNote.content
                : partnerNote.content;

        return { loginUsersNote, partnerNote, initialText };
    }, [resultOfFetchNoteList]);

    return {
        loginUsersNote,
        partnerNote,
        refreshing,
        developerTextAreaHeight: Math.max(
            MIN_TEXT_AREA_HEIGHT,
            developerTextAreaHeight,
        ),
        inputtingText,
        initialText,
        isNoteChanged,
    };
};
