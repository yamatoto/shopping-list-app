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

export default function ConfigureScreen() {
    const [modalVisible, setModalVisible] = useState(false);

    const handleToggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <View style={sharedStyles.container}>
            <TouchableOpacity style={styles.button} onPress={handleToggleModal}>
                <Text style={styles.buttonText}>実装予定</Text>
            </TouchableOpacity>
            <SignOut />
            <PlannedFeaturesModal
                visible={modalVisible}
                onClose={handleToggleModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
