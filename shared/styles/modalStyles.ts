import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
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
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonContainerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 10,
    },
    buttonContainerVertical: {
        flexDirection: 'column',
        width: '100%',
    },
    buttonInHorizontal: {
        borderRadius: 10,
        padding: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonInVertical: {
        borderRadius: 10,
        padding: 10,
        minWidth: 100,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        fontSize: 18,
    },
    areaInput: {
        height: 100,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
    },
    textViewArea: {
        height: 100,
        width: '100%',
        paddingVertical: 10,
        textAlignVertical: 'top',
    },
    itemContainer: {
        marginVertical: 10,
        width: '100%',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    quantityInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityAdjustButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityAdjustButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});
