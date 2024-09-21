export const CONFIGURE_PATHS = [
    'note',
    'archive',
    'featureRequest',
    'bugReport',
] as const;
export type ConfigurePath = (typeof CONFIGURE_PATHS)[number];
