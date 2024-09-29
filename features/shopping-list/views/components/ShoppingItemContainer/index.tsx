import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import ShoppingItemEditModal from '@/features/shopping-list/views/components/ShoppingItemEditModal';
import { shoppingItemContainerStyles } from '@/features/shopping-list/views/components/ShoppingItemContainer/styles';
import { SCREEN, ScreenLabel } from '@/features/shopping-list/constants/screen';
import { InputValues } from '@/features/shopping-list/models/form';

type Props = {
    screenLabel: ScreenLabel;
    item: DisplayItem;
    categorySelectItems: { label: string; value: string }[];
    shoppingPlatformDetailSelectItems: { label: string; value: string }[];
    onConfirm: (values: InputValues) => void;
    onAddToAnother: (item: DisplayItem) => void;
};
const SCREEN_MAP = {
    [SCREEN.CURRENT]: (item: DisplayItem) => ({
        isAddedAnother: item.isFrequent,
        anotherLabel: SCREEN.FREQUENT,
    }),
    [SCREEN.FREQUENT]: (item: DisplayItem) => ({
        isAddedAnother: item.isCurrent,
        anotherLabel: SCREEN.CURRENT,
    }),
} as const;
export default function ShoppingItemContainer({
    screenLabel,
    item,
    categorySelectItems,
    shoppingPlatformDetailSelectItems,
    onConfirm,
    onAddToAnother,
}: Props) {
    const { isAddedAnother, anotherLabel } = SCREEN_MAP[screenLabel](item);
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <TouchableOpacity
            style={sharedStyles.itemContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={1}
        >
            <View style={sharedStyles.itemContent}>
                {screenLabel === SCREEN.CURRENT && (
                    <View style={shoppingItemContainerStyles.quantityContainer}>
                        <Text style={shoppingItemContainerStyles.quantityText}>
                            {item.quantity}
                        </Text>
                    </View>
                )}
                {modalVisible && (
                    <ShoppingItemEditModal
                        screenLabel={screenLabel}
                        onConfirm={onConfirm}
                        item={item}
                        categorySelectItems={categorySelectItems}
                        shoppingPlatformDetailSelectItems={
                            shoppingPlatformDetailSelectItems
                        }
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                )}
                <Text style={sharedStyles.itemNameText}>{item.name}</Text>
                <View style={sharedStyles.shopLabelBorder}>
                    <Text style={sharedStyles.shopLabelText}>
                        {item.shoppingPlatformDetailLabel}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={e => {
                    e.stopPropagation();
                    onAddToAnother(item);
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
