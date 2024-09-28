import React, { useEffect, useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import { useCategoryQuery } from '@/features/configure/category/queries/useCategoryQuery';
import { useCategoryUsecase } from '@/features/configure/category/usecases/useCategoryUsecase';
import HiddenDeleteButton from '@/shared/components/HiddenDeleteButton';
import CategoryContainer from '@/features/configure/category/views/components/CategoryContainer';
import CommonSwipeListView from '@/shared/components/CommonSwipeListView';
import { categoryStyles } from '@/features/configure/category/views/pages/styles';
import { CategoryModel } from '@/shared/models/categorySortModel';
import ButtonAdd from '@/shared/components/ButtonAdd';

export default function Category() {
    const { categories, refreshing, tempNewCategoryName } = useCategoryQuery();
    const {
        initialize,
        handleRefresh,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        setTempNewCategoryName,
    } = useCategoryUsecase();

    useEffect(() => {
        initialize().then();
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: CategoryModel }) => {
            return (
                <CategoryContainer
                    category={item}
                    onConfirm={updatedCategoryName =>
                        handleUpdateCategory(item, updatedCategoryName)
                    }
                />
            );
        },
        [handleAddCategory, handleUpdateCategory],
    );

    const renderHiddenItem = useCallback(
        ({ item }: { item: CategoryModel }) => (
            <HiddenDeleteButton onPress={() => handleDeleteCategory(item)} />
        ),
        [handleDeleteCategory],
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={sharedStyles.container}>
                <View style={categoryStyles.inputContainer}>
                    <TextInput
                        style={categoryStyles.input}
                        value={tempNewCategoryName}
                        onChangeText={setTempNewCategoryName}
                        placeholderTextColor="#888"
                        placeholder="カテゴリ名を追加"
                    />
                    <ButtonAdd
                        onPress={() => handleAddCategory(tempNewCategoryName)}
                    />
                </View>

                <CommonSwipeListView
                    data={categories}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    refreshing={refreshing}
                    handleRefresh={handleRefresh}
                />
            </View>
        </GestureHandlerRootView>
    );
}
