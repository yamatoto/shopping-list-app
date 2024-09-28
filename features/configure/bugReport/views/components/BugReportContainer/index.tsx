import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { sharedStyles } from '@/shared/styles/sharedStyles';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { bugReportContainerStyles } from '@/features/configure/bugReport/views/components/BugReportContainer/styles';
import {
    BUF_REPORT_PRIORITY,
    BUF_REPORT_PRIORITY_TO_LABEL,
    DisplayBugReport,
} from '@/shared/models/requestModel';
import RequestEditModal from '@/shared/components/RequestEditModal';

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
                <RequestEditModal
                    contentLabel="バグ内容"
                    request={bugReport}
                    updateRequest={updateBugReport}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    priorities={BUF_REPORT_PRIORITY}
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
                    {!bugReport.rejected && !bugReport.completed && (
                        <Text style={bugReportContainerStyles.priorityText}>
                            重要度:{' '}
                            {BUF_REPORT_PRIORITY_TO_LABEL[bugReport.priority]}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </>
    );
}
