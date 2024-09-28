import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

import RequestEditModal from '@/shared/components/RequestEditModal';
import { sharedStyles } from '@/shared/styles/sharedStyles';
import {
    DisplayFeatureRequest,
    FEATURE_REQUEST_PRIORITY,
    FEATURE_REQUEST_PRIORITY_TO_LABEL,
} from '@/shared/models/requestModel';
import useFirebaseAuth from '@/shared/auth/useFirebaseAuth';
import { featureRequestContainerStyles } from '@/features/configure/featureRequest/views/components/FeatureRequestContainer/styles';

type Props = {
    featureRequest: DisplayFeatureRequest;
    handleCompleteFeatureRequestCheckToggle: (
        updated: DisplayFeatureRequest,
    ) => void;
    updateFeatureRequest: (updated: Partial<DisplayFeatureRequest>) => void;
};
export default function FeatureRequestContainer({
    featureRequest,
    updateFeatureRequest,
    handleCompleteFeatureRequestCheckToggle,
}: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const { currentUser } = useFirebaseAuth();

    const handleCheckboxToggle = (checked: boolean) => {
        handleCompleteFeatureRequestCheckToggle({
            ...featureRequest,
            completed: checked,
        });
    };

    return (
        <>
            {modalVisible && (
                <RequestEditModal
                    contentLabel="実装要望内容"
                    request={featureRequest}
                    updateRequest={updateFeatureRequest}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    priorities={FEATURE_REQUEST_PRIORITY}
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
                                featureRequest.completed
                                    ? 'checked'
                                    : 'unchecked'
                            }
                            onPress={() =>
                                handleCheckboxToggle(!featureRequest.completed)
                            }
                        />
                    )}
                    <Text style={featureRequestContainerStyles.contentText}>
                        {featureRequest.content}
                    </Text>
                    {!featureRequest.rejected && !featureRequest.completed && (
                        <Text
                            style={featureRequestContainerStyles.priorityText}
                        >
                            優先度:
                            {
                                FEATURE_REQUEST_PRIORITY_TO_LABEL[
                                    featureRequest.priority
                                ]
                            }
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </>
    );
}
