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
export const SHOPPING_PLATFORM_TO_ID_MAP: {
    [key in ShoppingPlatformLabel]: ShoppingPlatformId;
} = {
    [SHOPPING_PLATFORM.SUPER.label]: SHOPPING_PLATFORM.SUPER.id,
    [SHOPPING_PLATFORM.NET.label]: SHOPPING_PLATFORM.NET.id,
} as const;

export const SHOPPING_PLATFORM_DETAIL = {
    NOT_SET: { id: 'NotSet', label: '未設定' },
    SUPER: { id: 'S1', label: 'スーパー' },
    AMAZON: { id: 'N1', label: 'Amazon' },
    RAKUTEN: { id: 'N2', label: '楽天' },
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
    [SHOPPING_PLATFORM_DETAIL.SUPER.id]: SHOPPING_PLATFORM_DETAIL.SUPER.label,
    [SHOPPING_PLATFORM_DETAIL.AMAZON.id]: SHOPPING_PLATFORM_DETAIL.AMAZON.label,
    [SHOPPING_PLATFORM_DETAIL.RAKUTEN.id]:
        SHOPPING_PLATFORM_DETAIL.RAKUTEN.label,
} as const;
export const SHOPPING_PLATFORM_DETAIL_TO_ID_MAP: {
    [key in ShoppingPlatformDetailLabel]: ShoppingPlatformDetailId;
} = {
    [SHOPPING_PLATFORM_DETAIL.NOT_SET.label]:
        SHOPPING_PLATFORM_DETAIL.NOT_SET.id,
    [SHOPPING_PLATFORM_DETAIL.SUPER.label]: SHOPPING_PLATFORM_DETAIL.SUPER.id,
    [SHOPPING_PLATFORM_DETAIL.AMAZON.label]: SHOPPING_PLATFORM_DETAIL.AMAZON.id,
    [SHOPPING_PLATFORM_DETAIL.RAKUTEN.label]:
        SHOPPING_PLATFORM_DETAIL.RAKUTEN.id,
} as const;
