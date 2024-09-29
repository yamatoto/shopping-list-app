import React, { useCallback, useEffect } from 'react';
import {
    SectionListData,
    Text,
    TouchableOpacity,
    View,
    SectionListRenderItemInfo,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommonSwipeListView from '../../../../../shared/components/CommonSwipeListView';

import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { frequentShoppingListStyles } from '@/features/shopping-list/views/pages/FrequentShoppingList/styles';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import ItemAddForm from '@/features/shopping-list/views/components/ItemAddForm';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import ShoppingPlatformButtons from '@/features/shopping-list/views/components/ShoppingPlatformButtons';

export default function FrequentShoppingList() {
    const {
        frequentItemSections,
        refreshing,
        openSections,
        tempNewItemName,
        categorySelectItems,
        selectedShoppingPlatformId,
    } = useShoppingListQuery();
    const {
        initialize,
        handleRefresh,
        handleAddItem,
        handleUpdateItem,
        handleDeleteItem,
        handleAddToCurrent,
        toggleSection,
        setTempNewItemName,
        handleShoppingPlatformSelect,
    } = useShoppingListUsecase();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item, section }: SectionListRenderItemInfo<DisplayItem>) => {
            return openSections[section.id] ? (
                <ShoppingItemContainer
                    screenLabel={SCREEN.FREQUENT}
                    item={item}
                    categorySelectItems={categorySelectItems}
                    onConfirm={values =>
                        handleUpdateItem(item, values, SCREEN.FREQUENT)
                    }
                    onAddToAnother={handleAddToCurrent}
                />
            ) : (
                <EmptyComponent />
            );
        },
        [
            openSections,
            handleUpdateItem,
            handleAddToCurrent,
            categorySelectItems,
        ],
    );

    const renderHiddenItem = useCallback(
        ({ item, section }: SectionListRenderItemInfo<DisplayItem>) => {
            return openSections[section.id] ? (
                <HiddenDeleteButton
                    onPress={() => handleDeleteItem(item, SCREEN.FREQUENT)}
                />
            ) : (
                <EmptyComponent />
            );
        },
        [openSections, handleDeleteItem],
    );

    const renderSectionHeader = useCallback(
        ({ section }: { section: SectionListData<DisplayItem> }) => (
            <TouchableOpacity onPress={() => toggleSection(section.id)}>
                <View style={frequentShoppingListStyles.sectionHeader}>
                    <Text style={frequentShoppingListStyles.sectionHeaderText}>
                        {section.title}
                    </Text>
                    <Text>{openSections[section.id] ? '▲' : '▼'}</Text>
                </View>
            </TouchableOpacity>
        ),
        [openSections, toggleSection],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <ItemAddForm
                    screenLabel={SCREEN.FREQUENT}
                    tempNewItemName={tempNewItemName}
                    setTempNewItemName={setTempNewItemName}
                    onAdd={handleAddItem}
                />

                <ShoppingPlatformButtons
                    selectedShoppingPlatformId={selectedShoppingPlatformId}
                    onSelect={handleShoppingPlatformSelect}
                />

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
