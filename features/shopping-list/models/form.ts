import { DisplayItem } from '@/shared/models/itemModel';

export const INPUT_KEY_LABELS: Partial<Record<keyof DisplayItem, string>> = {
    name: '商品名',
    quantity: '数量',
    categoryId: 'カテゴリー',
};

export type InputValues = {
    name: string;
    quantity?: string;
    categoryId: string;
};

export type FormattedInputValues = {
    name: string;
    quantity?: number;
    categoryId: string;
};
