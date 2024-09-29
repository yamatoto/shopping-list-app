import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import 'react-native-get-random-values';
import { useColorScheme } from '@/shared/styles/useColorScheme';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import SignInOrUpWithEmail from '@/shared/auth/SignInOrUpWithEmail';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().then();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const { isAuthenticated } = useFirebaseAuth();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync().then();
        }
    }, [loaded]);

    if (!loaded) return null;

    if (!isAuthenticated) {
        return <SignInOrUpWithEmail />;
    }

    return (
        <RootSiblingParent>
            <ThemeProvider
                value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ThemeProvider>
        </RootSiblingParent>
    );
}
