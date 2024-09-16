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
