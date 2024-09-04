import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Button,
    Alert,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import { useNote } from '@/context/NoteContext';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

interface MemoModalProps {
    visible: boolean;
    onClose: () => void;
}

const MemoModal: React.FC<MemoModalProps> = ({ visible, onClose }) => {
    const { currentUser } = useFirebaseAuth();
    const { noteMap, fetchNote, updateNote } = useNote();
    const [yamatoText, setYamatoText] = useState('');
    const [mihoText, setMihoText] = useState('');
    const [initialYamatoText, setInitialYamatoText] = useState('');
    const [initialMihoText, setInitialMihoText] = useState('');
    const [yamatoHeight, setYamatoHeight] = useState(500);
    const [mihoHeight, setMihoHeight] = useState(500);

    useEffect(() => {
        if (visible) {
            fetchNote().then();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    useEffect(() => {
        if (!noteMap) return;

        const yamatoContent = noteMap['yamato']?.content ?? '';
        const mihoContent = noteMap['miho']?.content ?? '';

        setYamatoText(yamatoContent);
        setMihoText(mihoContent);

        setInitialYamatoText(yamatoContent);
        setInitialMihoText(mihoContent);

        setYamatoHeight(Math.max(100, yamatoContent.split('\n').length * 20));
        setMihoHeight(Math.max(100, mihoContent.split('\n').length * 20));
    }, [noteMap]);

    const handleYamatoSubmit = async () => {
        await updateNote(yamatoText);
        showToast('更新しました');
    };

    const handleMihoSubmit = async () => {
        await updateNote(mihoText);
        showToast('更新しました');
    };

    const showToast = (message: string) => {
        Toast.show(message, 300, {});
    };

    const handleClose = () => {
        if (yamatoText === initialYamatoText && mihoText === initialMihoText) {
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
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Yamatoのメモ</Text>
                    <TextInput
                        style={[styles.textArea, { height: yamatoHeight }]}
                        multiline
                        numberOfLines={4}
                        value={yamatoText}
                        onChangeText={setYamatoText}
                        onContentSizeChange={event =>
                            setYamatoHeight(
                                event.nativeEvent.contentSize.height,
                            )
                        }
                        editable={currentUser?.name === 'yamato'}
                        placeholderTextColor="#000"
                    />
                    {currentUser?.name === 'yamato' && (
                        <Button title="更新" onPress={handleYamatoSubmit} />
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mihoのメモ</Text>
                    <TextInput
                        style={[styles.textArea, { height: mihoHeight }]}
                        multiline
                        numberOfLines={4}
                        value={mihoText}
                        onChangeText={setMihoText}
                        onContentSizeChange={event =>
                            setMihoHeight(event.nativeEvent.contentSize.height)
                        }
                        editable={currentUser?.name === 'miho'}
                        placeholderTextColor="#000"
                    />
                    {currentUser?.name === 'miho' && (
                        <Button title="更新" onPress={handleMihoSubmit} />
                    )}
                </View>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    textArea: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        marginBottom: 10,
        color: '#000',
    },
});

export default MemoModal;
