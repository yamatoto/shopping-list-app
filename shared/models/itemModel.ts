import { Timestamp } from 'firebase/firestore';

import {
    ShoppingPlatformDetailId,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';

export interface ItemBase {
    // add時にはidは不要
    name: string;
    quantity: number;
    isCurrent: boolean;
    isFrequent: boolean;
    categoryId: string;
    createdUser: string;
    updatedUser: string;
    message?: string;
    shoppingPlatformId: ShoppingPlatformId;
    shoppingPlatformDetailId: ShoppingPlatformDetailId;
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
