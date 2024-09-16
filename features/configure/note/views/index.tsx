import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';

import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useNoteQuery } from '@/features/configure/note/queries/useNoteQuery';
import { useNoteUsecase } from '@/features/configure/note/usecases/useNoteUsecase';
import NoteForm from '@/features/configure/note/components/NoteForm';
import { noteStyles } from '@/features/configure/note/views/styles';

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
    const { currentUser } = useFirebaseAuth();
    const {
        developerNote,
        partnerNote,
        developerTextAreaHeight,
        partnerTextAreaHeight,
        initialText,
        isNoteChanged,
    } = useNoteQuery();
    const {
        initialize,
        handleUpdateNote,
        handleChangeDeveloperTextAreaHeight,
        handleChangePartnerTextAreaHeight,
        handleTextChange,
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
            <ScrollView contentContainerStyle={noteStyles.scrollViewContent}>
                {developerNote?.content != null && (
                    <NoteForm
                        note={developerNote}
                        textAreaHeight={developerTextAreaHeight}
                        handleChangeTextAreaHeight={
                            handleChangeDeveloperTextAreaHeight
                        }
                        editable={
                            currentUser?.email === developerNote.userEmail
                        }
                        handleUpdateNote={handleUpdateNote}
                        onChangeText={handleTextChange}
                    />
                )}
                {partnerNote?.content != null && (
                    <NoteForm
                        note={partnerNote}
                        textAreaHeight={partnerTextAreaHeight}
                        handleChangeTextAreaHeight={
                            handleChangePartnerTextAreaHeight
                        }
                        editable={currentUser?.email === partnerNote.userEmail}
                        handleUpdateNote={handleUpdateNote}
                        onChangeText={handleTextChange}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
