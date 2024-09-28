import Toast from 'react-native-root-toast';

export const useToast = () => {
    const showToast = (message: string, duration = Toast.durations.SHORT) => {
        Toast.show(message, {
            duration: duration,
            position: Toast.positions.BOTTOM,
            hideOnPress: true,
            delay: 0,
        });
    };

    return {
        showToast,
    };
};
