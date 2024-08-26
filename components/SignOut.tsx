import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';

import useFirebaseAuth from '@/hooks/useFirebaseAuth';

export default function SignOut() {
    const { signOut } = useFirebaseAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>ログアウト</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: Platform.OS === 'ios' ? '#007AFF' : '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
