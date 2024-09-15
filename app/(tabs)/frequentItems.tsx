import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    SectionList,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StyleSheet } from 'react-native';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useShoppingListQuery } from '@/features/shopping-list/queries/useShoppingListQuery';
import { useShoppingListUsecase } from '@/features/shopping-list/usecases/useShoppingListUsecase';
import { DisplayItem } from '@/features/shopping-list/models/itemModel';
import ShoppingItemContainer from '@/features/shopping-list/components/ShoppingItemContainer';
import { CATEGORIES } from '@/features/shopping-list/constants/category';

export default function FrequentShoppingListScreen() {
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
                            handleAddItem(newItemName, false).then();
                        }}
                    >
                        <Text style={sharedStyles.addButtonText}>追加</Text>
                    </TouchableOpacity>
                </View>

                <SectionList
                    sections={CATEGORIES.map(category => ({
                        title: category,
                        data: groupedItems[category] || [],
                    })).filter(section => section.data.length > 0)}
                    renderItem={({ item, section }) =>
                        openSections[section.title] ? (
                            <SwipeListView
                                data={[item]}
                                renderItem={({ item }) => renderItem({ item })}
                                renderHiddenItem={({ item }) =>
                                    renderHiddenItem({ item })
                                }
                                rightOpenValue={-75}
                                disableRightSwipe
                                closeOnRowOpen={true}
                            />
                        ) : null
                    }
                    renderSectionHeader={({ section: { title } }) => (
                        <TouchableOpacity onPress={() => toggleSection(title)}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionHeaderText}>
                                    {title}
                                </Text>
                                <Text>{openSections[title] ? '▲' : '▼'}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
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

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionHeaderText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
