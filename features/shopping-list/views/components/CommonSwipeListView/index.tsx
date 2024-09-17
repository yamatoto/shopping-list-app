import React from 'react';
import {
    ListRenderItem,
    ListRenderItemInfo,
    RefreshControl,
    SectionListData,
    SectionListRenderItemInfo,
    ViewStyle,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

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
    contentContainerStyle?: StyleProp<ViewStyle>;
    ItemSeparatorComponent?: React.ComponentType<any> | null;
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
    contentContainerStyle,
    ItemSeparatorComponent,
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
            contentContainerStyle={contentContainerStyle}
            ItemSeparatorComponent={ItemSeparatorComponent}
        />
    );
}

export default CommonSwipeListView;
