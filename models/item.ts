interface ItemBase {
    id: string;
    name: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CurrentItem extends ItemBase {
    completed: boolean;
}

export interface FrequentItem extends ItemBase {
    isAdded: boolean;
}
