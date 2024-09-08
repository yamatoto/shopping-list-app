import { useCallback } from 'react';
import Toast from 'react-native-simple-toast';
import {
    NativeSyntheticEvent,
    TextInputContentSizeChangeEventData,
} from 'react-native';

import * as NoteRepository from '@/api/noteRepository';
import { useNoteStore } from '@/store/useNoteStore';

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
            Toast.show('メモの取得に失敗しました。', 300, {});
        }
    }, []);

    const handleUpdateNote = useCallback(
        async (noteId: string, content: string) => {
            try {
                await NoteRepository.updateNote(noteId, content);
            } catch (error: any) {
                console.error(error);
                Toast.show('ノートの更新に失敗しました。', 300, {});
            }
            await fetchNoteList();
        },
        [fetchNoteList],
    );

    const initialize = useCallback(async () => {
        await fetchNoteList();
    }, []);

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
