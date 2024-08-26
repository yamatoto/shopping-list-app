import { ClientDataBase } from '@/models/base';

export interface NoteBase {
    content: string;
    user: 'yamato' | 'miho';
    createdBy: string;
    updatedBy: string;
}

export type Note = NoteBase & ClientDataBase;
