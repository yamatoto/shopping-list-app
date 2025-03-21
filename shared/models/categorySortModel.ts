import { Timestamp } from 'firebase/firestore';

export interface CategoryModel {
    id: string;
    name: string;
}

export interface CategorySortBase {
    categories: CategoryModel[];
    updatedUser: string;
}

export interface ApiResponseCategorySort extends CategorySortBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
