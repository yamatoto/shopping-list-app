import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { TextInputContentSizeChangeEventData } from 'react-native/Libraries/Components/TextInput/TextInput';

import { DisplayNote } from '@/features/configure/note/models/noteModel';
import ModalTextArea from '@/shared/components/ModalTextArea';
import SubmitButton from '@/shared/components/SubmitButton';

type Props = {
    note: DisplayNote;
    textAreaHeight: number;
    handleChangeTextAreaHeight: (
        e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => void;
    editable: boolean;
    handleUpdateNote: (id: string, content: string) => void;
    onChangeText: (text: string) => void;
};

export default function NoteForm({
    note: { id, displayName, content },
    textAreaHeight,
    handleChangeTextAreaHeight,
    editable,
    handleUpdateNote,
    onChangeText,
}: Props) {
    const [text, setText] = useState(content);

    return (
        <View style={{ marginBottom: 20 }}>
            <ModalTextArea
                label={`${displayName}のメモ`}
                value={text}
                onChangeText={text => {
                    setText(text);
                    onChangeText(text);
                }}
                editable={editable}
                onContentSizeChange={handleChangeTextAreaHeight}
                placeholderTextColor="#bbb"
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
}
