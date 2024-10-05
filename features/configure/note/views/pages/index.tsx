import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';

import { useNoteQuery } from '@/features/configure/note/queries/useNoteQuery';
import { useNoteUsecase } from '@/features/configure/note/usecases/useNoteUsecase';
import NoteForm from '@/features/configure/note/views/components/NoteForm';
import { noteStyles } from '@/features/configure/note/views/pages/styles';
import Loading from '@/shared/components/Loading';

type RootStackParamList = {
    index: undefined;
    'planned-features': undefined;
    note: undefined;
};

type NoteScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'note'
>;

export default function Note() {
    const navigation = useNavigation<NoteScreenNavigationProp>();
    const {
        loginUsersNote,
        partnerNote,
        developerTextAreaHeight,
        initialText,
        isNoteChanged,
        refreshing,
    } = useNoteQuery();
    const {
        initialize,
        handleUpdateNote,
        handleChangeDeveloperTextAreaHeight,
        handleTextChange,
        handleRefresh,
    } = useNoteUsecase();

    useFocusEffect(
        useCallback(() => {
            return navigation.addListener('beforeRemove', e => {
                if (!isNoteChanged) {
                    // 変更がない場合は、通常通り画面を離れる
                    return;
                }

                // 変更がある場合は、デフォルトの動作を防ぐ
                e.preventDefault();

                // ユーザーに確認する
                Alert.alert(
                    '確認',
                    '変更した内容を破棄してもよろしいですか？',
                    [
                        {
                            text: 'キャンセル',
                            style: 'cancel',
                            onPress: () => {},
                        },
                        {
                            text: 'OK',
                            style: 'destructive',
                            // このコールバックを呼び出すと画面を離れる
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ],
                );
            });
        }, [navigation, isNoteChanged]),
    );

    useFocusEffect(
        useCallback(() => {
            initialize().then();
            return () => {
                // クリーンアップ関数
                handleTextChange(initialText);
            };
        }, []),
    );

    return (
        <SafeAreaView style={noteStyles.safeArea}>
            <ScrollView
                contentContainerStyle={noteStyles.scrollViewContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#5cb85c']}
                        tintColor="#5cb85c"
                    />
                }
            >
                {!loginUsersNote.content ? (
                    <Loading />
                ) : (
                    <NoteForm
                        note={loginUsersNote}
                        textAreaHeight={developerTextAreaHeight}
                        handleChangeTextAreaHeight={
                            handleChangeDeveloperTextAreaHeight
                        }
                        handleUpdateNote={handleUpdateNote}
                        onChangeText={handleTextChange}
                    />
                )}
                <View>
                    <Text style={noteStyles.partnerNoteTitle}>
                        {partnerNote?.userName}のメモ
                    </Text>
                    <Text>{partnerNote?.content || 'メモはありません'}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
