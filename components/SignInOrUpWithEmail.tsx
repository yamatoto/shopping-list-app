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
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="ログイン" onPress={handleSignIn} />
            <Button title="新規登録" onPress={handleSignUp} />
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
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
});
