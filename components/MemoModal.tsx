import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Button,
} from 'react-native';

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

    useEffect(() => {
        if (visible) {
            fetchNote().then();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    useEffect(() => {
        if (!noteMap) return;

        setYamatoText(noteMap['yamato']?.content ?? '');
        setMihoText(noteMap['miho']?.content ?? '');
    }, [noteMap]);

    const handleYamatoSubmit = async () => {
        await updateNote(yamatoText);
    };

    const handleMihoSubmit = async () => {
        await updateNote(mihoText);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>閉じる</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Yamatoのメモ</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={4}
                        value={yamatoText}
                        onChangeText={setYamatoText}
                        editable={currentUser?.name === 'yamato'}
                    />
                    {currentUser?.name === 'yamato' && (
                        <Button title="更新" onPress={handleYamatoSubmit} />
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mihoのメモ</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={4}
                        value={mihoText}
                        onChangeText={setMihoText}
                        editable={currentUser?.name === 'miho'}
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
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
});

export default MemoModal;
