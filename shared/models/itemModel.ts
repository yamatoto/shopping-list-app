import { Timestamp } from 'firebase/firestore';

import { Category } from '@/features/shopping-list/constants/category';

export interface ItemBase {
    // add時にはidは不要
    name: string;
    quantity: number;
    isCurrent: boolean;
    isFrequent: boolean;
    category: Category;
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
