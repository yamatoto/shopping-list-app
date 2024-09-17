import React from 'react';
import {
    ListRenderItem,
    ListRenderItemInfo,
    RefreshControl,
    SectionListData,
    SectionListRenderItemInfo,
    View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

type RenderItemInfo<T> =
    | ListRenderItem<T>
    | ((info: SectionListRenderItemInfo<T>) => React.ReactElement | null);

type RenderHiddenItemInfo<T> =
    | ((
          rowData: ListRenderItemInfo<T>,
          rowMap: { [key: string]: any },
      ) => React.ReactElement | null)
    | ((
          info: SectionListRenderItemInfo<T>,
          rowMap: { [key: string]: any },
      ) => React.ReactElement | null);

type Section<T> = SectionListData<T>;

export type Props<T> = {
    data?: T[];
    sections?: Section<T>[];
    renderItem: RenderItemInfo<T>;
    renderSectionHeader?: (info: {
        section: Section<T>;
    }) => React.ReactElement | null;
    renderHiddenItem?: RenderHiddenItemInfo<T>;
    keyExtractor?: (item: T, index: number) => string;
    refreshing: boolean;
    handleRefresh: () => void;
    useSectionList?: boolean;
    rightOpenValue?: number;
    disableRightSwipe?: boolean;
    closeOnRowOpen?: boolean;
};

function CommonSwipeListView<T extends { id: string }>({
    data,
    sections,
    renderItem,
    renderSectionHeader,
    renderHiddenItem,
    keyExtractor,
    refreshing,
    handleRefresh,
    useSectionList = false,
    rightOpenValue = -75,
    disableRightSwipe = true,
    closeOnRowOpen = true,
}: Props<T>) {
    const commonProps = {
        renderItem,
        keyExtractor: keyExtractor || (item => item.id),
        refreshControl: (
            <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#5cb85c']}
                tintColor="#5cb85c"
            />
        ),
    };

    const swipeProps = renderHiddenItem
        ? {
              renderHiddenItem,
              rightOpenValue,
              disableRightSwipe,
              closeOnRowOpen,
          }
        : {};

    const listProps = useSectionList
        ? { useSectionList, sections, renderSectionHeader }
        : { data };

    return (
        <SwipeListView
            {...commonProps}
            {...swipeProps}
            {...listProps}
            ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: '#f0f0f0' }} />
            )}
        />
    );
}

export default CommonSwipeListView;
