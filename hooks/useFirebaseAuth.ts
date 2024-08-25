import FirebaseAuth from '@react-native-firebase/auth';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';

import { GOOGLE_WEB_CLIENT_ID } from '@/config/firabase';

const auth = FirebaseAuth();

console.log(`GOOGLE_WEB_CLIENT_ID:::${GOOGLE_WEB_CLIENT_ID}`);

GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
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
            if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert(
                    `Play Services が利用できません. ${JSON.stringify(error)}`,
                );
            }
            alert(`hasPlayServicesでエラー. ${JSON.stringify(error)}`);
            return;
        }

        try {
            const user = await GoogleSignin.signIn();

            const idToken = user.idToken;
            if (idToken === null) {
                throw new Error(`idToken is null. user: ${user}`);
            }

            const credential =
                FirebaseAuth.GoogleAuthProvider.credential(idToken);
            await auth.signInWithCredential(credential);
        } catch (error) {
            alert(`signInWithGoogleでエラー. ${JSON.stringify(error)}`);
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(
                email,
                password,
            );
            alert(`userCredential:${JSON.stringify(userCredential)}`);
        } catch (error: any) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('登録済のメールアドレスです');
                    return;
                case 'auth/invalid-email':
                    alert('無効なメールアドレスです');
                    return;
                default:
                    alert(`登録に失敗しました${JSON.stringify(error)}`);
            }
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(
                email,
                password,
            );
            alert(`userCredential::: ${JSON.stringify(userCredential)}`);
        } catch (error) {
            alert(`signInWithEmailでエラー. ${JSON.stringify(error)}`);
        }
    };

    const signOut = async () => {
        await auth.signOut();
    };

    return {
        currentUserEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithEmail,
        signOut,
    };
};

export default useFirebaseAuth;
