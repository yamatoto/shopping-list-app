import { StyleSheet } from 'react-native';

export const bugReportEditModalStyles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
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

export const pickerSelectStyles = StyleSheet.create({
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
