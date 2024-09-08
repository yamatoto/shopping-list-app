import { ClientDataBase, ServerResponseBase } from '@/models/baseModel';

export interface ItemBase {
    name: string;
    quantity: number;
    isCurrent: boolean;
    isFrequent: boolean;
    createdUser: string;
    updatedUser: string;
}

export interface ApiResponseItem extends ServerResponseBase, ItemBase {}

export interface DisplayItem extends ClientDataBase, ItemBase {}
