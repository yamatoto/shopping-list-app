import Toast from 'react-native-root-toast';

export const showToast = (message: string) => {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
    });
};
