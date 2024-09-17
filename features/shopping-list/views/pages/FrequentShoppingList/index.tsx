import React, { useEffect, useState } from 'react';
import {
    SectionListData,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SectionListRenderItemInfo,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { CATEGORIES } from '@/features/shopping-list/constants/category';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { frequentShoppingListStyles } from '@/features/shopping-list/views/pages/FrequentShoppingList/styles';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import CommonSwipeListView from '@/features/shopping-list/views/components/CommonSwipeListView';

export default function FrequentShoppingList() {
    const { frequentItemSections, refreshing } = useShoppingListQuery();
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

    const renderItem = ({
        item,
        section,
    }: SectionListRenderItemInfo<DisplayItem>) =>
        openSections[section.title] ? (
            <ShoppingItemContainer
                item={item}
                updateItem={newItem => handleUpdateItem(item, newItem, '定番')}
                onAddToAnother={() => handleAddToCurrent(item)}
                isCurrentScreen={false}
            />
        ) : (
            <EmptyComponent />
        );

    const renderHiddenItem = ({
        item,
        section,
    }: SectionListRenderItemInfo<DisplayItem>) =>
        openSections[section.title] ? (
            <View style={sharedStyles.rowBack}>
                <TouchableOpacity
                    style={sharedStyles.backRightBtn}
                    onPress={() => handleDeleteItem(item, false)}
                >
                    <Text style={sharedStyles.backTextWhite}>削除</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <EmptyComponent />
        );

    const renderSectionHeader = ({
        section: { title },
    }: {
        section: SectionListData<DisplayItem>;
    }) => (
        <TouchableOpacity onPress={() => toggleSection(title)}>
            <View style={frequentShoppingListStyles.sectionHeader}>
                <Text style={frequentShoppingListStyles.sectionHeaderText}>
                    {title}
                </Text>
                <Text>{openSections[title] ? '▲' : '▼'}</Text>
            </View>
        </TouchableOpacity>
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

                <CommonSwipeListView
                    useSectionList
                    sections={frequentItemSections}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    renderSectionHeader={renderSectionHeader}
                    refreshing={refreshing}
                    handleRefresh={handleRefresh}
                />
            </View>
        </GestureHandlerRootView>
    );
}
