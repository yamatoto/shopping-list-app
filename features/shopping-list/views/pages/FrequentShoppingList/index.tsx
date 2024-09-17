import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { CATEGORIES } from '@/features/shopping-list/constants/category';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { frequentShoppingListStyles } from '@/features/shopping-list/views/pages/FrequentShoppingList/styles';
const EmptyComponent = () => <View style={{ height: 0 }} />;
type SectionListRenderItemInfo<T> = {
    item: T;
    index: number;
    section: { title: string; data: T[] };
    separators: {
        highlight: () => void;
        unhighlight: () => void;
        updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
    };
};
export default function FrequentShoppingList() {
    const { groupedItems, refreshing } = useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToCurrent,
    } = useShoppingListUsecase();
    const [newItemName, setNewItemName] = useState('');

    const [openSections, setOpenSections] = useState<{
        [key: string]: boolean;
    }>({});

    const toggleSection = (category: string) => {
        setOpenSections(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    useEffect(() => {
        initialize().then();
        const initialOpenSections = CATEGORIES.reduce(
            (acc, category) => {
                acc[category] = true;
                return acc;
            },
            {} as { [key: string]: boolean },
        );
        setOpenSections(initialOpenSections);
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: DisplayItem }) => {
            return (
                <ShoppingItemContainer
                    item={item}
                    updateItem={newItem =>
                        handleUpdateItem(item, newItem, '定番')
                    }
                    onAddToAnother={() => handleAddToCurrent(item)}
                    isCurrentScreen={false}
                />
            );
        },
        [handleUpdateItem, handleAddToCurrent],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: DisplayItem }) => (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => handleDeleteItem(item, false)}
                >
                    <Text style={sharedStyles.backTextWhite}>削除</Text>
                </TouchableOpacity>
            </View>
        ),
        [handleDeleteItem],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={sharedStyles.inputContainer}>
                    <TextInput
                        style={sharedStyles.input}
                        value={newItemName}
                        onChangeText={setNewItemName}
                        placeholderTextColor="#888"
                        placeholder="新しい定番の買い物を追加"
                    />
                    <TouchableOpacity
                        style={sharedStyles.addButton}
                        onPress={() => {
                            setNewItemName('');
                            handleAddItem(newItemName, '定番').then();
                        }}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>

                <SwipeListView
                    useSectionList
                    sections={CATEGORIES.map(category => ({
                        title: category,
                        data: groupedItems[category] || [],
                    })).filter(section => section.data.length > 0)}
                    renderItem={({
                        item,
                        section,
                    }: SectionListRenderItemInfo<DisplayItem>) =>
                        openSections[section.title] ? (
                            renderItem({ item })
                        ) : (
                            <EmptyComponent />
                        )
                    }
                    renderHiddenItem={({
                        item,
                        section,
                    }: SectionListRenderItemInfo<DisplayItem>) =>
                        openSections[section.title] ? (
                            renderHiddenItem({ item })
                        ) : (
                            <EmptyComponent />
                        )
                    }
                    renderSectionHeader={({ section: { title } }) => (
                        <TouchableOpacity onPress={() => toggleSection(title)}>
                            <View
                                style={frequentShoppingListStyles.sectionHeader}
                            >
                                <Text
                                    style={
                                        frequentShoppingListStyles.sectionHeaderText
                                    }
                                >
                                    {title}
                                </Text>
                                <Text>{openSections[title] ? '▲' : '▼'}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                    rightOpenValue={-75}
                    disableRightSwipe
                    closeOnRowOpen={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#5cb85c']}
                            tintColor="#5cb85c"
                        />
                    }
                />
            </View>
        </GestureHandlerRootView>
    );
}
