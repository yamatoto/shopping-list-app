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
                        title: '直近の買い物',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="list" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="frequentItems"
                    options={{
                        title: '定番アイテム',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="star" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </ShoppingListProvider>
    );
}
