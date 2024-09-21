import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

import { configureStyles } from './styles';

import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import { DEVELOPER_EMAIL } from '@/shared/config/user';
import { ConfigurePath } from '@/features/configure/constants/path';

export default function Configure({
    handleRoute,
}: {
    handleRoute: (path: ConfigurePath) => void;
}) {
    const { currentUser, signOut } = useFirebaseAuth();

    return (
        <View style={sharedStyles.container}>
            <View style={configureStyles.topButtonsContainer}>
                <TouchableOpacity
                    style={configureStyles.button}
                    onPress={() => handleRoute('archive')}
                >
                    <Text style={configureStyles.buttonText}>アーカイブ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={configureStyles.button}
                    onPress={() => handleRoute('featureRequest')}
                >
                    <Text style={configureStyles.buttonText}>実装要望</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={configureStyles.button}
                    onPress={() => handleRoute('bugReport')}
                >
                    <Text style={configureStyles.buttonText}>バグ報告</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={configureStyles.button}
                    onPress={() => handleRoute('category')}
                >
                    <Text style={configureStyles.buttonText}>カテゴリー</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={configureStyles.button}
                    onPress={() => handleRoute('note')}
                >
                    <Text style={configureStyles.buttonText}>メモ</Text>
                </TouchableOpacity>
            </View>

            <View style={configureStyles.signOutContainer}>
                {currentUser?.email === DEVELOPER_EMAIL && (
                    <TouchableOpacity
                        style={configureStyles.button}
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
                        <Text style={configureStyles.buttonText}>
                            サインアウト
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
