import { Tabs } from 'expo-router';
import { ShoppingListProvider } from '@/context/ShoppingListContext';

export default function TabsLayout() {
    return (
        <ShoppingListProvider>
            <Tabs>
                <Tabs.Screen name="index" options={{ title: '直近の買い物' }} />
                <Tabs.Screen name="frequentItems" options={{ title: '定番アイテム' }} />
            </Tabs>
        </ShoppingListProvider>
    );
}
