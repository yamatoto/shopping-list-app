interface ItemBase {
    id: string;
    name: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CurrentItem extends ItemBase {
    isAddedToFrequent: boolean;
    completed: boolean;
}

export interface FrequentItem extends ItemBase {
    isAddedToCurrent: boolean;
}
