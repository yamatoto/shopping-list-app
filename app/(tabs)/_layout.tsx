import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { SCREEN } from '@/features/shopping-list/constants/screen';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: `${SCREEN.CURRENT}の買い物リスト`,
                    tabBarLabel: `${SCREEN.CURRENT}の買い物`,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="frequentItems"
                options={{
                    headerTitle: `${SCREEN.FREQUENT}の買い物リスト`,
                    tabBarLabel: `${SCREEN.FREQUENT}の買い物`,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="star" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="configure"
                options={{
                    headerShown: false,
                    tabBarLabel: '設定',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
