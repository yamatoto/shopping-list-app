import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';

import {
    SHOPPING_PLATFORM,
    ShoppingPlatform,
} from '@/shared/constants/shoppingPlatform';
import { shoppingPlatformButtonsStyles } from '@/features/shopping-list/views/components/ShoppingPlatformButtons/styles';

const SHOPPING_PLATFORMS = Object.values(SHOPPING_PLATFORM);

type Props = {
    selectedShoppingPlatform: ShoppingPlatform;
    onSelect: (shoppingPlatform: ShoppingPlatform) => void;
};
export default function ShoppingPlatformButtons({
    selectedShoppingPlatform,
    onSelect,
}: Props) {
    return (
        <View
            style={
                shoppingPlatformButtonsStyles.shoppingPlatformButtonsContainer
            }
        >
            {SHOPPING_PLATFORMS.map(platform => {
                const isSelected = selectedShoppingPlatform === platform;
                return (
                    <TouchableOpacity
                        key={platform}
                        style={[
                            shoppingPlatformButtonsStyles.button,
                            isSelected &&
                                shoppingPlatformButtonsStyles.selectedButton,
                        ]}
                        onPress={() => onSelect(platform)}
                    >
                        <Text
                            style={[
                                shoppingPlatformButtonsStyles.buttonText,
                                isSelected &&
                                    shoppingPlatformButtonsStyles.selectedButtonText,
                            ]}
                        >
                            {platform}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
