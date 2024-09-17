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
    activeItemStyle: {
        backgroundColor: '#f0f0f0',
    },
});
