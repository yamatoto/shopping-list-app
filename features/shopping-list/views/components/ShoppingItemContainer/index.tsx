import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import ShoppingItemEditModal from '@/features/shopping-list/views/components/ShoppingItemEditModal';
import { shoppingItemContainerStyles } from '@/features/shopping-list/views/components/ShoppingItemContainer/styles';

type Props = {
    item: DisplayItem;
    updateItem: (updatedItem: Partial<DisplayItem>) => void;
    onAddToAnother: () => void;
    isCurrentScreen: boolean;
};
export default function ShoppingItemContainer({
    item,
    updateItem,
    onAddToAnother,
    isCurrentScreen,
}: Props) {
    const { isAddedAnother, anotherLabel } = isCurrentScreen
        ? { isAddedAnother: item.isFrequent, anotherLabel: '定番' }
        : { isAddedAnother: item.isCurrent, anotherLabel: '直近' };
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <TouchableOpacity
            style={sharedStyles.itemContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={1}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                {isCurrentScreen && (
                    <View style={shoppingItemContainerStyles.quantityContainer}>
                        <Text style={shoppingItemContainerStyles.quantityText}>
                            {item.quantity ?? 1}
                        </Text>
                    </View>
                )}
                {modalVisible && (
                    <ShoppingItemEditModal
                        updateItem={updateItem}
                        item={item}
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        isCurrent={isCurrentScreen}
                    />
                )}
                <Text style={sharedStyles.itemNameText}>{item.name}</Text>
            </View>
            <TouchableOpacity
                onPress={e => {
                    e.stopPropagation(); // 子コンポーネントのタッチイベントが親に伝播しないようにする
                    onAddToAnother();
                }}
                disabled={isAddedAnother}
                style={[
                    sharedStyles.button,
                    isAddedAnother
                        ? sharedStyles.addedButton
                        : sharedStyles.addButton,
                ]}
            >
                <Text
                    style={sharedStyles.buttonText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {isAddedAnother
                        ? `${anotherLabel}に追加済`
                        : `${anotherLabel}に追加`}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
