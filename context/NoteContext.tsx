import React, { createContext, useState, useContext, ReactNode } from 'react';

import * as NoteRepository from '@/api/noteRepository';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import { Note } from '@/models/note';

type NoteMap = {
    yamato: Note;
    miho: Note;
};

interface NoteContextType {
    loading: boolean;
    error: string | null;
    noteMap: NoteMap | null;
    fetchNote: () => Promise<void>;
    updateNote: (content: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [noteMap, setNoteMap] = useState<NoteMap | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useFirebaseAuth();

    const fetchNote = async () => {
        setLoading(true);
        try {
            const noteList = await NoteRepository.fetchNoteList();
            setNoteMap({
                yamato: noteList.find(note => note.user === 'yamato')!,
                miho: noteList.find(note => note.user === 'miho')!,
            });
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateNote = async (content: string) => {
        const currentNote = noteMap![currentUser!.name];
        try {
            await NoteRepository.updateNote(
                {
                    ...currentNote!,
                    content,
                },
                currentUser!.email,
            );
            setNoteMap({
                ...noteMap!,
                [currentUser!.name]: { ...currentNote!, content },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <NoteContext.Provider
            value={{
                loading,
                error,
                noteMap,
                fetchNote,
                updateNote,
            }}
        >
            {children}
        </NoteContext.Provider>
    );
};

export const useNote = () => {
    const context = useContext(NoteContext);
    if (context === undefined) {
        throw new Error('useNote must be used within a NoteProvider');
    }
    return context;
};
