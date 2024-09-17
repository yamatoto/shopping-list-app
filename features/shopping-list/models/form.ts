import { Category } from '@/features/shopping-list/constants/category';
import { DisplayItem } from '@/shared/models/itemModel';

export const INPUT_KEY_LABELS: Partial<Record<keyof DisplayItem, string>> = {
    name: '商品名',
    quantity: '数量',
    category: 'カテゴリー',
};

export type InputValues = {
    name: string;
    quantity?: string;
    category: Category;
};

export type FormattedInputValues = {
    name: string;
    quantity?: number;
    category: Category;
};
