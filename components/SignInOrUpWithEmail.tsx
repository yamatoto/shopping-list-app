import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

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
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
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
