import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputContentSizeChangeEventData } from 'react-native/Libraries/Components/TextInput/TextInput';

import { DisplayNote } from '@/features/configure/note/models/noteModel';
import ModalTextArea from '@/shared/components/ModalTextArea';
import SubmitButton from '@/shared/components/SubmitButton';
import { noteFormStyles } from '@/features/configure/note/views/components/styles';

type Props = {
    note: DisplayNote;
    textAreaHeight: number;
    handleChangeTextAreaHeight: (
        e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => void;
    handleUpdateNote: (id: string, content: string) => void;
    onChangeText: (text: string) => void;
};

export default function NoteForm({
    note: { id, userName, content },
    textAreaHeight,
    handleChangeTextAreaHeight,
    handleUpdateNote,
    onChangeText,
}: Props) {
    const [text, setText] = useState(content);

    return (
        <View style={noteFormStyles.formContainer}>
            <ModalTextArea
                label={`${userName}のメモ`}
                value={text}
                onChangeText={text => {
                    setText(text);
                    onChangeText(text);
                }}
                editable={true}
                onContentSizeChange={handleChangeTextAreaHeight}
                placeholderTextColor="#bbb"
                style={[noteFormStyles.textArea, { height: textAreaHeight }]}
                placeholder="メモを入力してください"
            />
            <SubmitButton
                title="更新"
                disabled={text === content}
                onPress={() => handleUpdateNote(id, text)}
            />
        </View>
    );
}
