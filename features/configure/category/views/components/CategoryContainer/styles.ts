import { StyleSheet } from 'react-native';

import { dynamicFontSize } from '@/shared/styles/sharedStyles';

export const categoryContainerStyles = StyleSheet.create({
    nameText: {
        fontSize: dynamicFontSize,
        flexGrow: 1,
        maxWidth: '60%',
        marginLeft: 8,
        marginRight: 10,
        flex: 1,
    },
});
