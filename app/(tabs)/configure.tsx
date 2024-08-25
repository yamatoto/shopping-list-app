import React from 'react';
import { View } from 'react-native';

import { sharedStyles } from '@/styles/sharedStyles';
import SignOut from '@/components/SignOut';

export default function ConfigureScreen() {
    console.log('ConfigureScreen');

    return (
        <View style={sharedStyles.container}>
            <SignOut />
        </View>
    );
}
