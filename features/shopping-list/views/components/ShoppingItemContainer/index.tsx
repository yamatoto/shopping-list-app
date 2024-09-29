import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { DisplayItem } from '@/shared/models/itemModel';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { shoppingItemContainerStyles } from '@/features/shopping-list/views/components/ShoppingItemContainer/styles';
import { SCREEN, ScreenLabel } from '@/features/shopping-list/constants/screen';
import { SHOPPING_PLATFORM_DETAIL } from '@/shared/constants/shoppingPlatform';

type Props = {
    screenLabel: ScreenLabel;
    item: DisplayItem;
    onAddToAnother: (item: DisplayItem) => void;
    onPress: () => void;
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
    onAddToAnother,
    onPress,
}: Props) {
    const { isAddedAnother, anotherLabel } = SCREEN_MAP[screenLabel](item);

    return (
        <TouchableOpacity
            style={sharedStyles.itemContainer}
            onPress={onPress}
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
                <Text style={sharedStyles.itemNameText}>{item.name}</Text>
                {item.shoppingPlatformDetailId !==
                    SHOPPING_PLATFORM_DETAIL.NOT_SET.id && (
                    <View style={sharedStyles.shopLabelBorder}>
                        <Text style={sharedStyles.shopLabelText}>
                            {item.shoppingPlatformDetailLabel}
                        </Text>
                    </View>
                )}
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
