import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import SubmitButton from '@/shared/components/SubmitButton';

export default function SignInOrUpWithEmail() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signUpWithEmail, signInWithEmail } = useFirebaseAuth();

    const isInvalidInput = () => {
        if (!!email && !!password) return false;
        alert('メールアドレスとパスワードを入力してください');
        return true;
    };

    const handleSignUp = async () => {
        if (isInvalidInput()) return;
        await signUpWithEmail(email, password);
    };
    const handleSignIn = async () => {
        if (isInvalidInput()) return;
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
            <SubmitButton title="ログイン" onPress={handleSignIn} />
            <SubmitButton
                title="アカウント新規登録"
                onPress={handleSignUp}
                style={{ marginTop: 10 }}
            />
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
        backgroundColor: '#fff',
        color: '#000',
        opacity: 1,
    },
});
