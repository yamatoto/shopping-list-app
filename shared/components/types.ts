export type SectionListRenderItemInfo<T> = {
    item: T;
    index: number;
    section: { title: string; data: T[] };
    separators: {
        highlight: () => void;
        unhighlight: () => void;
        updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
    };
};
