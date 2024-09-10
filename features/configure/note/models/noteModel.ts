import { Timestamp } from 'firebase/firestore';

export interface NoteBase {
    id: string;
    content: string;
    displayName: string;
    userEmail: string;
    userType: 'developer' | 'partner';
}

export interface ApiResponseNote extends NoteBase {
    updatedAt: Timestamp;
}

export interface DisplayNote extends NoteBase {
    updatedAt: Date;
}
