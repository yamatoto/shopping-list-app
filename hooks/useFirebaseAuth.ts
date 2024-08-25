import FirebaseAuth from '@react-native-firebase/auth';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/config/firabase';

const auth = FirebaseAuth();

GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
});

const useFirebaseAuth = () => {
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(
        null,
    );

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(() => {
            if (auth.currentUser) {
                setCurrentUserEmail(auth.currentUser.email);
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
        } catch (error: any) {
            console.error('hasPlayServices error:', error);

            if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert(
                    `Play Services が利用できません. ${JSON.stringify(error)}`,
                );
            }
            alert(`hasPlayServicesでエラー. ${JSON.stringify(error)}`);
            return;
        }

        try {
            alert(`GOOGLE_WEB_CLIENT_ID: ${GOOGLE_WEB_CLIENT_ID}`);
            alert(
                `process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: ${process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID}`,
            );
            const user = await GoogleSignin.signIn();

            console.log(`user:::${JSON.stringify(user)}`);
            const idToken = user.idToken;
            if (idToken === null) {
                throw new Error(`idToken is null. user: ${user}`);
            }
            console.log('idToken:::', idToken);

            const credential =
                FirebaseAuth.GoogleAuthProvider.credential(idToken);
            await auth.signInWithCredential(credential);
        } catch (error) {
            console.error('signInWithGoogle error:', error);
            alert(`signInWithGoogleでエラー. ${JSON.stringify(error)}`);
        }
    };

    const signOut = async () => {
        await auth.signOut();
    };

    return { currentUserEmail, signInWithGoogle, signOut };
};

export default useFirebaseAuth;
