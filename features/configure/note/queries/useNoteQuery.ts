import { useMemo } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import {
    ApiResponseNote,
    DisplayNote,
} from '@/features/configure/note/models/noteModel';
import { useNoteStore } from '@/features/configure/note/store/useNoteStore';
import { DEVELOPER_EMAIL } from '@/shared/config/user';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';

const MIN_TEXT_AREA_HEIGHT = 100;

export const useNoteQuery = () => {
    const { currentUser } = useFirebaseAuth();
    const {
        resultOfFetchNoteList,
        developerTextAreaHeight,
        partnerTextAreaHeight,
        inputtingText,
    } = useNoteStore(
        ({
            resultOfFetchNoteList,
            developerTextAreaHeight,
            partnerTextAreaHeight,
            inputtingText,
        }) => ({
            resultOfFetchNoteList,
            developerTextAreaHeight,
            partnerTextAreaHeight,
            inputtingText,
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

    const { developerNote, partnerNote, initialText } = useMemo(() => {
        const { developerNote, partnerNote } = resultOfFetchNoteList.reduce<{
            developerNote: DisplayNote;
            partnerNote: DisplayNote;
        }>(
            (acc, fetchedNote) => {
                const converted = convertToClientNoteFromServer(fetchedNote);
                return {
                    ...acc,
                    [`${converted.userType}Note`]: converted,
                };
            },
            {
                developerNote: {} as DisplayNote,
                partnerNote: {} as DisplayNote,
            },
        );

        const initialText =
            currentUser?.email === DEVELOPER_EMAIL
                ? developerNote.content
                : partnerNote.content;

        return { developerNote, partnerNote, initialText };
    }, [resultOfFetchNoteList]);

    return {
        developerNote,
        partnerNote,
        developerTextAreaHeight: Math.max(
            MIN_TEXT_AREA_HEIGHT,
            developerTextAreaHeight,
        ),
        partnerTextAreaHeight: Math.max(
            MIN_TEXT_AREA_HEIGHT,
            partnerTextAreaHeight,
        ),
        inputtingText,
        initialText,
    };
};
