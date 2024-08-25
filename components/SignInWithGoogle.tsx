import 'react-native-reanimated';
import { Button, View, Text } from 'react-native';

import useFirebaseAuth from '@/hooks/useFirebaseAuth';

export default function SignInWithGoogle() {
    const { signInWithGoogle } = useFirebaseAuth();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>Googleでサインイン</Text>
            <Button
                title="Googleでサインイン"
                onPress={() => {
                    signInWithGoogle().then();
                }}
            />
        </View>
    );
}
