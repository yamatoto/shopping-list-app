import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputContentSizeChangeEventData } from 'react-native/Libraries/Components/TextInput/TextInput';

import { DisplayNote } from '@/features/configure/note/models/noteModel';
import ModalTextArea from '@/shared/components/ModalTextArea';
import SubmitButton from '@/shared/components/SubmitButton';

interface NoteFormModalProps {
    note: DisplayNote;
    textAreaHeight: number;
    handleChangeTextAreaHeight: (
        e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => void;
    editable: boolean;
    handleUpdateNote: (id: string, content: string) => void;
    onChangeText: (text: string) => void;
}

const NoteForm: React.FC<NoteFormModalProps> = ({
    note: { id, displayName, content },
    textAreaHeight,
    handleChangeTextAreaHeight,
    editable,
    handleUpdateNote,
    onChangeText,
}) => {
    const [text, setText] = useState(content);

    return (
        <View style={styles.inputContainer}>
            <ModalTextArea
                label={`${displayName}のメモ`}
                value={text}
                onChangeText={text => {
                    setText(text);
                    onChangeText(text);
                }}
                editable={editable}
                onContentSizeChange={handleChangeTextAreaHeight}
                placeholderTextColor="#000"
                style={{ height: textAreaHeight }}
                placeholder="メモを入力してください"
            />
            {editable && (
                <SubmitButton
                    title="更新"
                    onPress={() => handleUpdateNote(id, text)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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

export default NoteForm;
