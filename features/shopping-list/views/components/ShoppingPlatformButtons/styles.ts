import { StyleSheet } from 'react-native';

export const shoppingPlatformButtonsStyles = StyleSheet.create({
    shoppingPlatformButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#388E3C',
    },
    buttonText: {
        color: '#FFFFFF',
    },
    selectedButtonText: {
        fontWeight: 'bold',
    },
});
