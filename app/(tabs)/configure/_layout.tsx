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
                name="archive"
                options={{
                    headerShown: true,
                    headerTitle: 'アーカイブ買い物リスト',
                }}
            />
            <Stack.Screen
                name="featureRequest"
                options={{
                    headerShown: true,
                    headerTitle: '実装要望',
                }}
            />
            <Stack.Screen
                name="bugReport"
                options={{
                    headerShown: true,
                    headerTitle: 'バグ報告',
                }}
            />
            <Stack.Screen
                name="category"
                options={{
                    headerShown: true,
                    headerTitle: 'カテゴリー',
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
