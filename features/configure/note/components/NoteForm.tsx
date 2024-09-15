import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputContentSizeChangeEventData } from 'react-native/Libraries/Components/TextInput/TextInput';

import { DisplayNote } from '@/features/configure/note/models/noteModel';
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
            <Text style={styles.label}>{displayName}のメモ</Text>
            <TextInput
                style={[styles.textArea, { height: textAreaHeight }]}
                multiline
                numberOfLines={4}
                value={text}
                onChangeText={text => {
                    setText(text);
                    onChangeText(text);
                }}
                onContentSizeChange={handleChangeTextAreaHeight}
                editable={editable}
                placeholderTextColor="#000"
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
