import FirebaseAuth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/config/firabase';

const auth = FirebaseAuth();

GoogleSignin.configure({
    offlineAccess: true,
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
            const user = await GoogleSignin.signIn();
            const idToken = user.idToken;
            if (idToken === null) return;
            console.log('idToken:::', idToken);

            const credential =
                FirebaseAuth.GoogleAuthProvider.credential(idToken);
            await auth.signInWithCredential(credential);
        } catch (error) {
            console.error('signInWithGoogle error:', error);
        }
    };

    const signOut = async () => {
        await auth.signOut();
    };

    return { currentUserEmail, signInWithGoogle, signOut };
};

export default useFirebaseAuth;
