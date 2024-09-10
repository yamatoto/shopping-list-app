import { useCallback, useEffect } from 'react';
import {
    NativeSyntheticEvent,
    TextInputContentSizeChangeEventData,
} from 'react-native';

import * as NoteRepository from '@/features/configure/note/api/noteRepository';
import { useNoteStore } from '@/features/configure/note/store/useNoteStore';
import { ApiResponseNote } from '@/features/configure/note/models/noteModel';
import { setupNoteListener } from '@/features/configure/note/api/noteRepository';
import { showToast } from '@/shared/helpers/toast';

export const useNoteUsecase = () => {
    const {
        setResultOfFetchNoteList,
        setDeveloperTextAreaHeight,
        setPartnerTextAreaHeight,
        setInputtingText,
    } = useNoteStore();

    const fetchNoteList = useCallback(async () => {
        try {
            const noteList = await NoteRepository.fetchNoteList();
            setResultOfFetchNoteList(noteList);
        } catch (error: any) {
            console.error(error);
            showToast('メモの取得に失敗しました。');
        }
    }, []);

    const handleUpdateNote = useCallback(
        async (noteId: string, content: string) => {
            try {
                await NoteRepository.updateNote(noteId, content);
            } catch (error: any) {
                console.error(error);
                showToast('ノートの更新に失敗しました。');
            }
            await fetchNoteList();
        },
        [fetchNoteList],
    );

    const initialize = useCallback(async () => {
        await fetchNoteList();
    }, []);

    useEffect(() => {
        const unsubscribe = setupNoteListener(change => {
            const { displayName } = change.doc.data() as ApiResponseNote;
            showToast(`${displayName}のメモが更新されました。`);
            fetchNoteList().then();
        });
        return () => unsubscribe();
    }, [fetchNoteList]);

    const handleChangeDeveloperTextAreaHeight = useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
            setDeveloperTextAreaHeight(event.nativeEvent.contentSize.height);
        },
        [],
    );
    const handleChangePartnerTextAreaHeight = useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
            setPartnerTextAreaHeight(event.nativeEvent.contentSize.height);
        },
        [],
    );

    return {
        initialize,
        handleUpdateNote,
        handleChangeDeveloperTextAreaHeight,
        handleChangePartnerTextAreaHeight,
        setInputtingText,
    };
};
