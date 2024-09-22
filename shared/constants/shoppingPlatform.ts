export const SHOPPING_PLATFORM: {
    [key: string]: string;
} = {
    SUPER: 'スーパー',
    AMAZON: 'Amazon',
    RAKUTEN: '楽天',
} as const;

export type ShoppingPlatform =
    (typeof SHOPPING_PLATFORM)[keyof typeof SHOPPING_PLATFORM];
