import { StyleSheet } from 'react-native';

export const categoryStyles = StyleSheet.create({
    addButtonContainer: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    addButton: {
        width: 'auto',
        backgroundColor: '#5cb85c',
        padding: 12,
        borderRadius: 5,
        justifyContent: 'center',
    },
    rowFront: {
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 'auto',
        padding: 10,
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
});
