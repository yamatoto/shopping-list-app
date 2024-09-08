import { Timestamp } from 'firebase/firestore';

export interface ItemBase {
    // Add時にはidは不要
    name: string;
    quantity: number;
    isCurrent: boolean;
    isFrequent: boolean;
    createdUser: string;
    updatedUser: string;
    message?: string;
}

export interface ApiResponseItem extends ItemBase {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DisplayItem extends ItemBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
