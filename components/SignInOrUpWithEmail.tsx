import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

import useFirebaseAuth from '@/hooks/useFirebaseAuth';

export default function SignInOrUpWithEmail() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signUpWithEmail, signInWithEmail } = useFirebaseAuth();

    const handleSignUp = async () => {
        await signUpWithEmail(email, password);
    };
    const handleSignIn = async () => {
        await signInWithEmail(email, password);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholderTextColor="#888"
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholderTextColor="#888"
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title="ログイン" onPress={handleSignIn} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="アカウント新規登録" onPress={handleSignUp} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#fff', // 背景色を白に設定
        color: '#000',
        opacity: 1, // 不透明に設定
    },
    buttonContainer: {
        marginVertical: 8,
    },
});
