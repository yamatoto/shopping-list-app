import React, { useCallback, useEffect } from 'react';
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
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { frequentShoppingListStyles } from '@/features/shopping-list/views/pages/FrequentShoppingList/styles';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import CommonSwipeListView from '@/features/shopping-list/views/components/CommonSwipeListView';

export default function FrequentShoppingList() {
    const { frequentItemSections, refreshing, openSections, tempNewItemName } =
        useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToCurrent,
        toggleSection,
        setTempNewItemName,
    } = useShoppingListUsecase();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item, section }: SectionListRenderItemInfo<DisplayItem>) => {
            return openSections[section.title] ? (
                <ShoppingItemContainer
                    item={item}
                    updateItem={newItem =>
                        handleUpdateItem(item, newItem, '定番')
                    }
                    onAddToAnother={() => handleAddToCurrent(item)}
                    isCurrentScreen={false}
                />
            ) : (
                <EmptyComponent />
            );
        },
        [openSections, handleUpdateItem, handleAddToCurrent],
    );

    const renderHiddenItem = useCallback(
        ({ item, section }: SectionListRenderItemInfo<DisplayItem>) => {
            return openSections[section.title] ? (
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
        },
        [openSections, handleDeleteItem],
    );

    const renderSectionHeader = useCallback(
        ({ section: { title } }: { section: SectionListData<DisplayItem> }) => (
            <TouchableOpacity onPress={() => toggleSection(title)}>
                <View style={frequentShoppingListStyles.sectionHeader}>
                    <Text style={frequentShoppingListStyles.sectionHeaderText}>
                        {title}
                    </Text>
                    <Text>{openSections[title] ? '▲' : '▼'}</Text>
                </View>
            </TouchableOpacity>
        ),
        [openSections, toggleSection],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={sharedStyles.inputContainer}>
                    <TextInput
                        style={sharedStyles.input}
                        value={tempNewItemName}
                        onChangeText={setTempNewItemName}
                        placeholderTextColor="#888"
                        placeholder="新しい定番の買い物を追加"
                    />
                    <TouchableOpacity
                        style={sharedStyles.addButton}
                        onPress={() => {
                            handleAddItem(tempNewItemName, '定番').then();
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
