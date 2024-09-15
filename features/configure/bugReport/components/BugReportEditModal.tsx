import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {
    DisplayBugReport,
    PRIORITY,
    PriorityValue,
} from '@/features/configure/bugReport/models/bugReportModel';

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
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.nameInput}
                        onChangeText={handleContentChange}
                        value={tempContent}
                        placeholder="バグ内容を入力"
                    />
                    <View style={styles.priorityContainer}>
                        <Text style={styles.label}>優先度</Text>
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
                            style={styles.nameInput}
                            onChangeText={handleRejectedReasonChange}
                            value={tempRejectedReason}
                            placeholder="却下理由を入力"
                        />
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>キャンセル</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.buttonText}>確定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    priorityContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    nameInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        fontSize: 18,
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    adjustButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adjustButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: 80,
        fontSize: 18,
        marginHorizontal: 10,
        textAlign: 'center',
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 20,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#789',
        borderRadius: 4,
        color: '#000',
    },
    inputAndroid: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
    },
});
