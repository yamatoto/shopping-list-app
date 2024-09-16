import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {
    DisplayBugReport,
    PRIORITY,
    PriorityValue,
} from '@/features/configure/bugReport/models/bugReportModel';
import {
    bugReportEditModalStyles,
    pickerSelectStyles,
} from '@/features/configure/bugReport/views/components/BugReportEditModal/styles';
import { modalStyles } from '@/shared/styles/modalStyles';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import Modal from '@/shared/components/Modal';

type Props = {
    bugReport?: DisplayBugReport;
    addBugReport?: (content: string, priority: PriorityValue) => void;
    updateBugReport?: (updatedItem: Partial<DisplayBugReport>) => void;
    visible: boolean;
    onClose: () => void;
};

export default function BugReportEditModal({
    bugReport,
    addBugReport,
    updateBugReport,
    visible,
    onClose,
}: Props) {
    const { currentUser } = useFirebaseAuth();
    const [selectedPriority, setSelectedPriority] = useState(
        bugReport?.priority || PRIORITY.HIGH.value,
    );

    const [tempContent, setTempContent] = useState(bugReport?.content ?? '');
    const [tempRejectedReason, setTempRejectedReason] = useState(
        bugReport?.rejectedReason ?? '',
    );

    const handleConfirm = async () => {
        if (addBugReport) {
            addBugReport(tempContent, selectedPriority);
        }
        if (updateBugReport) {
            updateBugReport({
                content: tempContent,
                rejectedReason: tempRejectedReason,
                priority: selectedPriority,
            });
        }
        onClose();
    };

    const handleContentChange = (text: string) => {
        setTempContent(text);
    };
    const handleRejectedReasonChange = (text: string) => {
        setTempRejectedReason(text);
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <View style={bugReportEditModalStyles.container}>
                <Text style={bugReportEditModalStyles.label}>バグ内容</Text>
                <TextInput
                    style={modalStyles.input}
                    multiline
                    numberOfLines={4}
                    onChangeText={handleContentChange}
                    value={tempContent}
                    placeholder="バグ内容を入力"
                    placeholderTextColor="#888"
                />
            </View>
            {!bugReport?.rejected && (
                <View style={bugReportEditModalStyles.container}>
                    <Text style={bugReportEditModalStyles.label}>優先度</Text>
                    <RNPickerSelect
                        placeholder={{}}
                        value={selectedPriority}
                        onValueChange={setSelectedPriority}
                        items={Object.values(PRIORITY)}
                        style={pickerSelectStyles}
                        disabled={!currentUser?.isDeveloper}
                    />
                </View>
            )}
            {bugReport?.rejected && (
                <View style={bugReportEditModalStyles.container}>
                    <Text style={modalStyles.label}>却下理由</Text>
                    <TextInput
                        style={modalStyles.input}
                        multiline
                        numberOfLines={4}
                        onChangeText={handleRejectedReasonChange}
                        value={tempRejectedReason}
                        placeholder="却下理由を入力"
                        editable={currentUser?.isDeveloper}
                    />
                </View>
            )}
            <View style={bugReportEditModalStyles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        bugReportEditModalStyles.button,
                        bugReportEditModalStyles.cancelButton,
                    ]}
                    onPress={onClose}
                >
                    <Text style={bugReportEditModalStyles.buttonText}>
                        キャンセル
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        bugReportEditModalStyles.button,
                        bugReportEditModalStyles.confirmButton,
                    ]}
                    onPress={handleConfirm}
                >
                    <Text style={bugReportEditModalStyles.buttonText}>
                        確定
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
