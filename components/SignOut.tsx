import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

import useFirebaseAuth from '@/hooks/useFirebaseAuth';

export default function SignOut() {
    const { signOut } = useFirebaseAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <View style={styles.container}>
            <Button title="ログアウト" onPress={handleSignOut} />
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
    buttonContainer: {
        marginVertical: 8,
    },
});
