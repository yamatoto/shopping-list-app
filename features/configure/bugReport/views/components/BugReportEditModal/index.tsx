import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
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

type Props = {
    bugReport?: DisplayBugReport;
    addBugReport?: (content: string, priority: PriorityValue) => void;
    updateBugReport?: (updatedItem: Partial<DisplayBugReport>) => void;
    visible: boolean;
    onClose: () => void;
};

// TODO: developerじゃなければRejectedReason非活性
export default function BugReportEditModal({
    bugReport,
    addBugReport,
    updateBugReport,
    visible,
    onClose,
}: Props) {
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={bugReportEditModalStyles.modalOverlay}>
                <View style={bugReportEditModalStyles.modalView}>
                    <TextInput
                        style={bugReportEditModalStyles.textInput}
                        onChangeText={handleContentChange}
                        value={tempContent}
                        placeholder="バグ内容を入力"
                    />
                    <View style={bugReportEditModalStyles.priorityContainer}>
                        <Text style={bugReportEditModalStyles.label}>
                            優先度
                        </Text>
                        <RNPickerSelect
                            placeholder={{}}
                            value={selectedPriority}
                            onValueChange={setSelectedPriority}
                            items={Object.values(PRIORITY)}
                            style={pickerSelectStyles}
                        />
                    </View>
                    {bugReport?.rejected && (
                        <TextInput
                            style={bugReportEditModalStyles.textInput}
                            onChangeText={handleRejectedReasonChange}
                            value={tempRejectedReason}
                            placeholder="却下理由を入力"
                        />
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
                </View>
            </View>
        </Modal>
    );
}
