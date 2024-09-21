export const CONFIGURE_PATHS = [
    'archive',
    'featureRequest',
    'bugReport',
    'category',
    'note',
] as const;
export type ConfigurePath = (typeof CONFIGURE_PATHS)[number];
