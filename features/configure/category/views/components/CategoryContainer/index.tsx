import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import CategoryEditModal from '@/features/configure/category/views/components/CategoryEditModal';
import { categoryContainerStyles } from '@/features/configure/category/views/components/CategoryContainer/styles';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { CategoryModel } from '@/shared/models/categorySortModel';

type Props = {
    category: CategoryModel;
    onConfirm: (updatedCategoryName: string) => void;
};
export default function CategoryContainer({ category, onConfirm }: Props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            {modalVisible && (
                <CategoryEditModal
                    category={category}
                    onConfirm={updatedCategoryName => {
                        onConfirm(updatedCategoryName);
                        setModalVisible(false);
                    }}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            )}
            <TouchableOpacity
                style={[sharedStyles.itemContainer, { paddingRight: 0 }]}
                activeOpacity={1}
                onPress={() => {
                    setModalVisible(true);
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    <Text style={categoryContainerStyles.nameText}>
                        {category.name}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    );
}
