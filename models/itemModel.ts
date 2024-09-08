import { Timestamp } from 'firebase/firestore';

export interface ItemBase {
    name: string;
    quantity: number;
    isCurrent: boolean;
    isFrequent: boolean;
    createdUser: string;
    updatedUser: string;
}

export interface ApiResponseItem extends ItemBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface DisplayItem extends ItemBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
