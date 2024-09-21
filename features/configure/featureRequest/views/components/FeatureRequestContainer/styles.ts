import { StyleSheet } from 'react-native';

import { dynamicFontSize } from '@/shared/styles/sharedStyles';

export const featureRequestContainerStyles = StyleSheet.create({
    contentText: {
        fontSize: dynamicFontSize,
        flexGrow: 1,
        maxWidth: '60%',
        marginLeft: 8,
        marginRight: 10,
        flex: 1,
    },
    priorityText: {
        fontSize: dynamicFontSize,
        maxWidth: '60%',
        textAlign: 'right',
    },
});
