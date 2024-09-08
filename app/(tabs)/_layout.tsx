import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
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
                    headerTitle: '定番の買い物リスト',
                    tabBarLabel: '定番の買い物',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="star" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="configure"
                options={{
                    headerTitle: '設定',
                    tabBarLabel: '設定',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
