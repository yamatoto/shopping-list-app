import { Timestamp } from 'firebase/firestore';

export interface NoteBase {
    id: string;
    content: string;
    userDisplayName: string;
    updatedUser: string;
}

export interface ApiResponseNote extends NoteBase {
    updatedAt: Timestamp;
}

export interface DisplayNote extends NoteBase {
    id: string;
    updatedAt: Date;
}
