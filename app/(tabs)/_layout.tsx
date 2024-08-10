import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ShoppingListProvider } from '@/context/ShoppingListContext';

export default function TabsLayout() {
    return (
        <ShoppingListProvider>
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        headerTitle: '直近の買い物リスト',
                        tabBarLabel: '直近の買い物',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="list" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="frequentItems"
                    options={{
                        headerTitle: '定番アイテムリスト',
                        tabBarLabel: '定番アイテム',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="star" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </ShoppingListProvider>
    );
}
