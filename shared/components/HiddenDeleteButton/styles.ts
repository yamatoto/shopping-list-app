import { StyleSheet } from 'react-native';

import { dynamicFontSize } from '@/shared/styles/sharedStyles';

export const hiddenDeleteButtonStyles = StyleSheet.create({
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
