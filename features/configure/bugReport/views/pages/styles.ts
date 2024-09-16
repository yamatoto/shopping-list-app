import { StyleSheet } from 'react-native';

export const bugReportStyles = StyleSheet.create({
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
    sectionHeader: {
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
    },
    rowFront: {
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 'auto',
        padding: 10,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        right: 0,
        backgroundColor: 'red',
    },
    backTextWhite: {
        color: '#FFF',
    },
});
