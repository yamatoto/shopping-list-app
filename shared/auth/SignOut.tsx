import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';

import ButtonSubmit from '@/shared/components/ButtonSubmit';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';

export default function SignOut() {
    const { signOut } = useFirebaseAuth();

    const handleSignOut = async () => {
        Alert.alert(
            '確認',
            'ログアウトしますか？',
            [
                {
                    text: 'キャンセル',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        signOut();
                    },
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <View style={styles.container}>
            <ButtonSubmit title={'ログアウト'} onPress={handleSignOut} />
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
});
