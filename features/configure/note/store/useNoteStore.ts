import { create } from 'zustand';
import { QueryDocumentSnapshot } from 'firebase/firestore';

import { ApiResponseNote } from '@/features/configure/note/models/noteModel';

type NoteStore = {
    resultOfFetchNoteList: QueryDocumentSnapshot<ApiResponseNote>[];
    setResultOfFetchNoteList: (
        apiItems: QueryDocumentSnapshot<ApiResponseNote>[],
    ) => void;
    developerTextAreaHeight: number;
    setDeveloperTextAreaHeight: (height: number) => void;
    inputtingText: string;
    setInputtingText: (text: string) => void;
    initialText: string;
    setInitialText: (text: string) => void;
    isNoteChanged: boolean;
    setIsNoteChanged: (isChanged: boolean) => void;
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
};

export const useNoteStore = create<NoteStore>(set => ({
    resultOfFetchNoteList: [],
    setResultOfFetchNoteList: noteList => {
        set({ resultOfFetchNoteList: noteList });
    },
    developerTextAreaHeight: 0,
    setDeveloperTextAreaHeight: (height: number) => {
        set({ developerTextAreaHeight: height });
    },
    inputtingText: '',
    setInputtingText: text => {
        set({ inputtingText: text });
    },
    initialText: '',
    setInitialText: text => {
        set({ initialText: text });
    },
    isNoteChanged: false,
    setIsNoteChanged: isChanged => {
        set({ isNoteChanged: isChanged });
    },
    refreshing: false,
    setRefreshing: (refreshing: boolean) => {
        set({ refreshing });
    },
}));
