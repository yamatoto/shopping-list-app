export interface Item {
    id: number;
    name: string;
    completed: boolean;
}

export interface FrequentItem extends Item {
    isAdded: boolean;
}
