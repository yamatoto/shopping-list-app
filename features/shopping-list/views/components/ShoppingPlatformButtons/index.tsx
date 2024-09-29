import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';

import {
    SHOPPING_PLATFORM_LIST,
    ShoppingPlatformId,
} from '@/shared/constants/shoppingPlatform';
import { shoppingPlatformButtonsStyles } from '@/features/shopping-list/views/components/ShoppingPlatformButtons/styles';

type Props = {
    selectedShoppingPlatformId: ShoppingPlatformId;
    onSelect: (shoppingPlatformId: ShoppingPlatformId) => void;
};
export default function ShoppingPlatformButtons({
    selectedShoppingPlatformId,
    onSelect,
}: Props) {
    return (
        <View
            style={
                shoppingPlatformButtonsStyles.shoppingPlatformButtonsContainer
            }
        >
            {SHOPPING_PLATFORM_LIST.map(platform => {
                const isSelected = selectedShoppingPlatformId === platform.id;
                return (
                    <TouchableOpacity
                        key={platform.id}
                        style={[
                            shoppingPlatformButtonsStyles.button,
                            isSelected &&
                                shoppingPlatformButtonsStyles.selectedButton,
                        ]}
                        onPress={() => onSelect(platform.id)}
                    >
                        <Text
                            style={[
                                shoppingPlatformButtonsStyles.buttonText,
                                isSelected &&
                                    shoppingPlatformButtonsStyles.selectedButtonText,
                            ]}
                        >
                            {platform.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
