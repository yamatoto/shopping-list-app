import React from 'react';
import {
    ListRenderItem,
    ListRenderItemInfo,
    RefreshControl,
    SectionList,
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
    sections?: readonly Section<T>[];
    renderItem: RenderItemInfo<T>;
    renderSectionHeader?: ({
        section,
    }: {
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
    isSwipeDisabled?: boolean;
};

function CommonSwipeListView<T extends { id: string }>({
    data,
    sections = [],
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

    if (useSectionList) {
        return (
            <SectionList
                {...commonProps}
                sections={sections}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={false}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: '#f0f0f0' }} />
                )}
            />
        );
    }

    return (
        <SwipeListView
            {...commonProps}
            {...swipeProps}
            data={data}
            ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: '#f0f0f0' }} />
            )}
        />
    );
}

export default CommonSwipeListView;
