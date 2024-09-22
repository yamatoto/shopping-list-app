import { Timestamp } from 'firebase/firestore';

export const DEFAULT_CATEGORY_VALUE = '未設定';
export interface CategoryModel {
    id: string;
    name: string;
}

export interface CategorySortBase {
    categories: CategoryModel[];
    updatedUserName: string;
}

export interface ApiResponseCategorySort extends CategorySortBase {
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
