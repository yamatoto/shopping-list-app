import { Timestamp } from 'firebase/firestore';

export interface CategoryBase {
    name: string;
    createdUserName: string;
    updatedUserName: string;
}

export interface ApiResponseCategory extends CategoryBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DisplayCategory extends CategoryBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
