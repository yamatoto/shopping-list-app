import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const dynamicFontSize = width * 0.035;
const dynamicButtonPadding = width * 0.015;
const dynamicButtonWidth = width * 0.2;

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: dynamicFontSize,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
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
        padding: dynamicButtonPadding,
        marginLeft: 5,
        borderRadius: 5,
        minWidth: dynamicButtonWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addedButton: {
        backgroundColor: '#cccccc',
    },
    deleteButton: {
        backgroundColor: '#ff6b6b',
    },
    buttonText: {
        color: '#fff',
        fontSize: dynamicFontSize,
        textAlign: 'center',
    },
    itemNameText: {
        fontSize: dynamicFontSize,
        flexGrow: 1,
        maxWidth: '60%',
    },
});
