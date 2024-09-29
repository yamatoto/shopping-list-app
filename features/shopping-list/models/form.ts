import { DisplayItem } from '@/shared/models/itemModel';
import { ShoppingPlatformDetailId } from '@/shared/constants/shoppingPlatform';

export const INPUT_KEY_LABELS: Partial<Record<keyof DisplayItem, string>> = {
    name: '商品名',
    quantity: '数量',
    categoryId: 'カテゴリー',
    shoppingPlatformDetailId: 'ショップ',
};

export interface InputValues {
    name: string;
    quantity?: string;
    categoryId: string;
    shoppingPlatformDetailId: ShoppingPlatformDetailId;
}

export interface FormattedInputValues extends Omit<InputValues, 'quantity'> {
    quantity?: number;
}
