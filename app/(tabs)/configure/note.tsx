import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
    } = useNoteQuery();
    const {
        initialize,
        handleUpdateNote,
        handleChangeDeveloperTextAreaHeight,
        handleChangePartnerTextAreaHeight,
        setInputtingText,
    } = useNoteUsecase();

    const [isNoteChanged, setIsNoteChanged] = useState(false);

    const handleTextChange = useCallback(
        (text: string) => {
            setInputtingText(text);
            setIsNoteChanged(text !== initialText);
        },
        [initialText, setInputtingText],
    );

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener('beforeRemove', e => {
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

            return unsubscribe;
        }, [navigation, isNoteChanged]),
    );

    // コンポーネントがマウントされたときに初期化
    useFocusEffect(
        useCallback(() => {
            initialize();
            return () => {
                // クリーンアップ関数
                setIsNoteChanged(false);
                setInputtingText(initialText);
            };
        }, [initialize, initialText, setInputtingText]),
    );

    if (!developerNote || !partnerNote) return null;

    return (
        <View style={styles.container}>
            <NoteForm
                note={developerNote}
                textAreaHeight={developerTextAreaHeight}
                handleChangeTextAreaHeight={handleChangeDeveloperTextAreaHeight}
                editable={currentUser?.email === developerNote.userEmail}
                handleUpdateNote={handleUpdateNote}
                onChangeText={handleTextChange}
            />
            <NoteForm
                note={partnerNote}
                textAreaHeight={partnerTextAreaHeight}
                handleChangeTextAreaHeight={handleChangePartnerTextAreaHeight}
                editable={currentUser?.email === partnerNote.userEmail}
                handleUpdateNote={handleUpdateNote}
                onChangeText={handleTextChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: 'white',
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
