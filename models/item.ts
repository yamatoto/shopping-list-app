import { ClientDataBase } from '@/models/base';

export interface ItemBase {
    name: string;
    sortOrder: number;
    createdBy: string;
    updatedBy: string;
}

export interface CurrentItemBase {
    isAddedToFrequent: boolean;
}

export interface FrequentItemBase {
    isAddedToCurrent: boolean;
}

export type CurrentItem = CurrentItemBase & ItemBase & ClientDataBase;
export type FrequentItem = FrequentItemBase & ItemBase & ClientDataBase;
