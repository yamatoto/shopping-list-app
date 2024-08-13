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
import { Button, View, Text } from 'react-native';

import { firebaseApp } from '@/config/firabase';
import { useColorScheme } from '@/hooks/useColorScheme';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const { currentUserEmail, signInWithGoogle } = useFirebaseAuth();

    useEffect(() => {
        console.log(
            firebaseApp.name ? 'Firebase initialized' : 'Firebase not working',
        );
    }, []);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    if (!currentUserEmail) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text>Sign in with Google</Text>
                <Button
                    title="Sign in with Google"
                    onPress={() => {
                        signInWithGoogle().then();
                    }}
                />
            </View>
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
