import React from 'react';
import { Stack } from 'expo-router';

export default function ConfigureLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTitle: '設定',
                }}
            />
            <Stack.Screen
                name="note"
                options={{
                    headerShown: true,
                    headerTitle: 'メモ',
                }}
            />
        </Stack>
    );
}
