import React, { useCallback } from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';

import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useNoteQuery } from '@/features/configure/note/queries/useNoteQuery';
import { useNoteUsecase } from '@/features/configure/note/usecases/useNoteUsecase';
import NoteForm from '@/features/configure/note/components/NoteForm';

type RootStackParamList = {
    index: undefined;
    'planned-features': undefined;
    note: undefined;
};

type NoteScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'note'
>;

export default function NoteScreen() {
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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        marginBottom: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
