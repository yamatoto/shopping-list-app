import { Timestamp } from 'firebase/firestore';

export interface NoteBase {
    id: string;
    content: string;
    userName: string;
}

export interface ApiResponseNote extends NoteBase {
    updatedAt: Timestamp;
}

export interface DisplayNote extends NoteBase {
    updatedAt: Date;
}
