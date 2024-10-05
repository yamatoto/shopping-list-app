import React, { useCallback, useEffect } from 'react';
import {
    SectionListData,
    Text,
    TouchableOpacity,
    View,
    SectionListRenderItemInfo,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CommonSwipeListView from '@/shared/components/CommonSwipeListView';
import { useFrequentShoppingListQuery } from '@/features/shopping-list/queries/useFrequentShoppingListQuery';
import { useFrequentShoppingListUsecase } from '@/features/shopping-list/usecases/useFrequentShoppingListUsecase';
import { DisplayItem } from '@/shared/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/views/components/ShoppingItemContainer';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { frequentShoppingListStyles } from '@/features/shopping-list/views/pages/FrequentShoppingList/styles';
import { EmptyComponent } from '@/shared/components/EmptyComponent';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import ItemAddForm from '@/features/shopping-list/views/components/ItemAddForm';
import { SCREEN } from '@/features/shopping-list/constants/screen';
import ShoppingPlatformButtons from '@/features/shopping-list/views/components/ShoppingPlatformButtons';
import ShoppingItemEditModal from '@/features/shopping-list/views/components/ShoppingItemEditModal';
import Loading from '@/shared/components/Loading';

export default function FrequentShoppingList() {
    const {
        frequentItemSections,
        refreshing,
        openSections,
        tempNewItemName,
        categorySelectItems,
        shoppingPlatformDetailSelectItems,
        selectedShoppingPlatformId,
        modalVisibleItem,
    } = useFrequentShoppingListQuery();
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
        handleShowItemModal,
        handleCloseItemModal,
    } = useFrequentShoppingListUsecase();

    useEffect(() => {
        initialize();
    }, []);

    const renderItem = useCallback(
        ({ item, section }: SectionListRenderItemInfo<DisplayItem>) => {
            return openSections[section.id] ? (
                <ShoppingItemContainer
                    screenLabel={SCREEN.FREQUENT}
                    item={item}
                    onPress={() => handleShowItemModal(item)}
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
                <HiddenDeleteButton onPress={() => handleDeleteItem(item)} />
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

                {frequentItemSections.length === 0 ? (
                    <Loading />
                ) : (
                    <CommonSwipeListView
                        useSectionList
                        sections={frequentItemSections}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        renderSectionHeader={renderSectionHeader}
                        refreshing={refreshing}
                        handleRefresh={handleRefresh}
                    />
                )}
                {modalVisibleItem && (
                    <ShoppingItemEditModal
                        screenLabel={SCREEN.FREQUENT}
                        onConfirm={values =>
                            handleUpdateItem(modalVisibleItem, values)
                        }
                        item={modalVisibleItem}
                        categorySelectItems={categorySelectItems}
                        shoppingPlatformDetailSelectItems={
                            shoppingPlatformDetailSelectItems
                        }
                        onClose={handleCloseItemModal}
                    />
                )}
            </View>
        </GestureHandlerRootView>
    );
}
