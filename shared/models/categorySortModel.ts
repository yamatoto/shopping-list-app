import { Timestamp } from 'firebase/firestore';

export const DEFAULT_CATEGORY = {
    id: '99311936-c1bb-47b1-9b1a-68a2eace3d5c',
    name: '未設定',
};
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
