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
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import SignInOrUpWithEmail from '@/components/SignInOrUpWithEmail';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    console.log('RootLayout');

    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const { currentUserEmail } = useFirebaseAuth();

    useEffect(() => {
        console.log('RootLayout useEffect');
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) return null;

    if (!currentUserEmail) {
        // return <SignInOrUpWithEmail />;
        return Platform.OS === 'ios' ? (
            <SignInOrUpWithEmail />
        ) : (
            <SignInWithGoogle />
        );
    }

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </ThemeProvider>
    );
}
