import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
} from 'react-native';

import useFirebaseAuth from '@/shared/hooks/useFirebaseAuth';
import { useNoteQuery } from '@/features/note/queries/useNoteQuery';
import { useNoteUsecase } from '@/features/note/usecases/useNoteUsecase';
import NoteFormModal from '@/features/note/components/NoteForm';

interface MemoModalProps {
    visible: boolean;
    onClose: () => void;
}

const NoteModal: React.FC<MemoModalProps> = ({ visible, onClose }) => {
    const { currentUser } = useFirebaseAuth();
    const {
        developerNote,
        partnerNote,
        developerTextAreaHeight,
        partnerTextAreaHeight,
        inputtingText,
        initialText,
    } = useNoteQuery();
    const {
        initialize,
        handleUpdateNote,
        handleChangeDeveloperTextAreaHeight,
        handleChangePartnerTextAreaHeight,
        setInputtingText,
    } = useNoteUsecase();

    useEffect(() => {
        if (visible) {
            initialize().then();
        }
    }, [visible]);

    if (!developerNote || !partnerNote) return null;

    const handleClose = () => {
        if (inputtingText === initialText) {
            setInputtingText(initialText);
            onClose(); // 変更がない場合はそのまま閉じる
            return;
        }

        Alert.alert(
            '確認',
            '変更した内容を破棄してもよろしいですか？',
            [
                {
                    text: 'キャンセル',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        setInputtingText(initialText);
                        onClose();
                    },
                },
            ],
            { cancelable: true },
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.modalContent}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                >
                    <Text style={styles.closeButtonText}>閉じる</Text>
                </TouchableOpacity>
                <NoteFormModal
                    note={developerNote}
                    textAreaHeight={developerTextAreaHeight}
                    handleChangeTextAreaHeight={
                        handleChangeDeveloperTextAreaHeight
                    }
                    editable={currentUser?.email === developerNote.updatedUser}
                    handleUpdateNote={handleUpdateNote}
                    onChangeText={setInputtingText}
                />
                <NoteFormModal
                    note={partnerNote}
                    textAreaHeight={partnerTextAreaHeight}
                    handleChangeTextAreaHeight={
                        handleChangePartnerTextAreaHeight
                    }
                    editable={currentUser?.email === partnerNote.updatedUser}
                    handleUpdateNote={handleUpdateNote}
                    onChangeText={setInputtingText}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
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

export default NoteModal;
