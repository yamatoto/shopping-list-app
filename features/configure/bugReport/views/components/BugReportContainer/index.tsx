import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import {
    DisplayBugReport,
    PRIORITY_TO_LABEL,
} from '@/features/configure/bugReport/models/bugReportModel';
import BugReportEditModal from '@/features/configure/bugReport/views/components/BugReportEditModal';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { bugReportContainerStyles } from '@/features/configure/bugReport/views/components/BugReportContainer/styles';

type Props = {
    bugReport: DisplayBugReport;
    handleCompleteBugReportCheckToggle: (updated: DisplayBugReport) => void;
    updateBugReport: (updated: Partial<DisplayBugReport>) => void;
};
export default function BugReportContainer({
    bugReport,
    updateBugReport,
    handleCompleteBugReportCheckToggle,
}: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const { currentUser } = useFirebaseAuth();

    const handleCheckboxToggle = (checked: boolean) => {
        handleCompleteBugReportCheckToggle({
            ...bugReport,
            completed: checked,
        });
    };

    return (
        <>
            {modalVisible && (
                <BugReportEditModal
                    bugReport={bugReport}
                    updateBugReport={updateBugReport}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            )}

            <TouchableOpacity
                style={[sharedStyles.itemContainer, { paddingRight: 0 }]}
                activeOpacity={1}
                onPress={() => setModalVisible(true)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    {currentUser?.isDeveloper && (
                        <Checkbox
                            status={
                                bugReport.completed ? 'checked' : 'unchecked'
                            }
                            onPress={() =>
                                handleCheckboxToggle(!bugReport.completed)
                            }
                        />
                    )}
                    <Text style={bugReportContainerStyles.contentText}>
                        {bugReport.content}
                    </Text>
                    <Text style={bugReportContainerStyles.priorityText}>
                        重要度: {PRIORITY_TO_LABEL[bugReport.priority]}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    );
}
