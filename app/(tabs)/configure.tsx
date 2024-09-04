import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';

import { sharedStyles } from '@/styles/sharedStyles';
import SignOut from '@/components/SignOut';
import PlannedFeaturesModal from '@/components/PlannedFeaturesModal';
import MemoModal from '@/components/MemoModal';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';

export default function ConfigureScreen() {
    const { currentUser } = useFirebaseAuth();

    const [plannedFeaturesModalVisible, setPlannedFeaturesModalVisible] =
        useState(false);
    const [memoModalVisible, setMemoModalVisible] = useState(false);

    const handleTogglePlannedFeaturesModal = () => {
        setPlannedFeaturesModalVisible(!plannedFeaturesModalVisible);
    };
    const handleToggleMemoModal = () => {
        setMemoModalVisible(!memoModalVisible);
    };

    return (
        <View style={sharedStyles.container}>
            <View style={styles.topButtonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleTogglePlannedFeaturesModal}
                >
                    <Text style={styles.buttonText}>実装予定</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleToggleMemoModal}
                >
                    <Text style={styles.buttonText}>メモ</Text>
                </TouchableOpacity>
            </View>

            {currentUser?.name === 'yamato' && (
                <View style={styles.signOutContainer}>
                    <SignOut />
                </View>
            )}

            <PlannedFeaturesModal
                visible={plannedFeaturesModalVisible}
                onClose={handleTogglePlannedFeaturesModal}
            />
            <MemoModal
                visible={memoModalVisible}
                onClose={handleToggleMemoModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    topButtonsContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    signOutContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Platform.OS === 'ios' ? '#007AFF' : '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
