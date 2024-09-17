export const CATEGORIES = [
    '未設定',
    '野菜',
    '果物',
    '肉・魚',
    '豆類',
    '海藻類',
    '乳製品',
    '調味料',
    '加工食品',
    '冷凍品',
    '菓子',
    '飲料',
    'キッチン用品',
    '日用品',
    'その他',
] as const;
export type Category = (typeof CATEGORIES)[number];
