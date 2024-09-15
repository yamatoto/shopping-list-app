import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { DEVELOPER_EMAIL } from '@/shared/config/user';

export default function ConfigureScreen() {
    const router = useRouter();
    const { currentUser, signOut } = useFirebaseAuth();

    return (
        <View style={sharedStyles.container}>
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/configure/note')}
                >
                    <Text style={styles.buttonText}>メモ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/configure/archive')}
                >
                    <Text style={styles.buttonText}>アーカイブ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.signOutContainer}>
                {currentUser?.email === DEVELOPER_EMAIL && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            Alert.alert('確認', 'サインアウトしますか？', [
                                {
                                    text: 'キャンセル',
                                    onPress: () => {},
                                    style: 'cancel',
                                },
                                {
                                    text: 'サインアウト',
                                    onPress: () => signOut(),
                                },
                            ]);
                        }}
                    >
                        <Text style={styles.buttonText}>サインアウト</Text>
                    </TouchableOpacity>
                )}
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
