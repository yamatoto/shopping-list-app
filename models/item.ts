export interface Item {
    id: number;
    text: string;
    completed: boolean;
}

export interface FrequentItem extends Item {
    isAdded: boolean;
}
