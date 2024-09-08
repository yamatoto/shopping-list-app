import { ClientDataBase } from '@/models/baseModel';

export interface NoteBase {
    content: string;
    user: 'yamato' | 'miho';
    createdUser: string;
    updatedUser: string;
}

export type Note = NoteBase & ClientDataBase;
