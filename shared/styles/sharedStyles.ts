import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const dynamicFontSize = Math.max(12, width * 0.03);
export const dynamicButtonWidth = Math.max(100, width * 0.25);

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f0f0f0',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#5cb85c',
        padding: 12,
        borderRadius: 5,
        justifyContent: 'center',
    },
    addButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: dynamicFontSize,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    activeItem: {
        backgroundColor: '#e0e0e0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
    },
    button: {
        padding: 6,
        borderRadius: 5,
        width: dynamicButtonWidth,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: dynamicFontSize,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: dynamicFontSize * 1.2,
    },
    addedButton: {
        backgroundColor: '#9E9E9E',
    },
    deleteButton: {
        backgroundColor: '#FF5252',
    },
    itemNameText: {
        fontSize: dynamicFontSize,
        flexGrow: 1,
        maxWidth: '60%',
        marginLeft: 15,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        right: 0,
        backgroundColor: '#FF5252',
    },
    backTextWhite: {
        color: '#FFF',
        fontSize: dynamicFontSize,
        fontWeight: 'bold',
    },
});

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
    buttonContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 100,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
});
