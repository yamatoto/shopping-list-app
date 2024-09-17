export const SCREEN = {
    CURRENT: '直近',
    FREQUENT: '定番',
} as const;
export type ScreenLabel = (typeof SCREEN)[keyof typeof SCREEN];
