import { Timestamp } from 'firebase/firestore';

export interface ApiResponseItemSort {
    id: string;
    itemType: 'current' | 'frequent';
    itemList: string[];
    updatedUser: string;
    updatedAt: Timestamp;
}
