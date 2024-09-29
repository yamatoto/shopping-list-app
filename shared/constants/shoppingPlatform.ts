export const SHOPPING_PLATFORM = {
    SUPER: { id: 1, label: 'スーパー' },
    NET: { id: 2, label: 'ネット' },
} as const;
export type ShoppingPlatformId =
    (typeof SHOPPING_PLATFORM)[keyof typeof SHOPPING_PLATFORM]['id'];
export type ShoppingPlatformLabel =
    (typeof SHOPPING_PLATFORM)[keyof typeof SHOPPING_PLATFORM]['label'];
export const SHOPPING_PLATFORM_LIST = Object.values(SHOPPING_PLATFORM);
export const SHOPPING_PLATFORM_TO_LABEL_MAP: {
    [key in ShoppingPlatformId]: ShoppingPlatformLabel;
} = {
    [SHOPPING_PLATFORM.SUPER.id]: SHOPPING_PLATFORM.SUPER.label,
    [SHOPPING_PLATFORM.NET.id]: SHOPPING_PLATFORM.NET.label,
} as const;

export const SHOPPING_PLATFORM_DETAIL = {
    NOT_SET: { id: 'NotSet', label: '未設定', shoppingPlatformId: 0 },
    SUMMIT: {
        id: 'S1',
        label: 'サミット',
        shoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
    },
    MY_BASKET: {
        id: 'S2',
        label: 'まいばすけっと',
        shoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
    },
    SELECTION: {
        id: 'S3',
        label: 'セレクション',
        shoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
    },
    MATSUKIYO: {
        id: 'S4',
        label: 'マツキヨ',
        shoppingPlatformId: SHOPPING_PLATFORM.SUPER.id,
    },
    AMAZON: {
        id: 'N1',
        label: 'Amazon',
        shoppingPlatformId: SHOPPING_PLATFORM.NET.id,
    },
    RAKUTEN: {
        id: 'N2',
        label: '楽天',
        shoppingPlatformId: SHOPPING_PLATFORM.NET.id,
    },
} as const;
export type ShoppingPlatformDetailId =
    (typeof SHOPPING_PLATFORM_DETAIL)[keyof typeof SHOPPING_PLATFORM_DETAIL]['id'];
export type ShoppingPlatformDetailLabel =
    (typeof SHOPPING_PLATFORM_DETAIL)[keyof typeof SHOPPING_PLATFORM_DETAIL]['label'];
export const SHOPPING_PLATFORM_DETAIL_LIST = Object.values(
    SHOPPING_PLATFORM_DETAIL,
);
export const SHOPPING_PLATFORM_DETAIL_TO_LABEL_MAP: {
    [key in ShoppingPlatformDetailId]: ShoppingPlatformDetailLabel;
} = {
    [SHOPPING_PLATFORM_DETAIL.NOT_SET.id]:
        SHOPPING_PLATFORM_DETAIL.NOT_SET.label,
    [SHOPPING_PLATFORM_DETAIL.SUMMIT.id]: SHOPPING_PLATFORM_DETAIL.SUMMIT.label,
    [SHOPPING_PLATFORM_DETAIL.MY_BASKET.id]:
        SHOPPING_PLATFORM_DETAIL.MY_BASKET.label,
    [SHOPPING_PLATFORM_DETAIL.SELECTION.id]:
        SHOPPING_PLATFORM_DETAIL.SELECTION.label,
    [SHOPPING_PLATFORM_DETAIL.MATSUKIYO.id]:
        SHOPPING_PLATFORM_DETAIL.MATSUKIYO.label,
    [SHOPPING_PLATFORM_DETAIL.AMAZON.id]: SHOPPING_PLATFORM_DETAIL.AMAZON.label,
    [SHOPPING_PLATFORM_DETAIL.RAKUTEN.id]:
        SHOPPING_PLATFORM_DETAIL.RAKUTEN.label,
} as const;
