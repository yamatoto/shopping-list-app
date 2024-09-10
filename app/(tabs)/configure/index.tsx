import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

import { sharedStyles } from '@/shared/styles/sharedStyles';

export default function ConfigureScreen() {
    const router = useRouter();

    return (
        <View style={sharedStyles.container}>
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/configure/planned-features')}
                >
                    <Text style={styles.buttonText}>実装予定</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/configure/note')}
                >
                    <Text style={styles.buttonText}>メモ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topButtonsContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    signOutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Platform.OS === 'ios' ? '#007AFF' : '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
