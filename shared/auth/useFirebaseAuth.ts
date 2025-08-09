import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as signOutFromFirebase,
} from '@/shared/config/firebase';
import { DEVELOPER_EMAIL } from '@/shared/config/user';

const useFirebaseAuth = () => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{
        email: string;
        displayName: string;
        isDeveloper: boolean;
    } | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser({
                    email: user.email!,
                    displayName: user.displayName!,
                    isDeveloper: user.email === DEVELOPER_EMAIL,
                });
                return;
            }
            setCurrentUser(null);
        });

        return () => unsubscribe();
    }, []);

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error(
                `createUserWithEmailAndPasswordでエラー: ${JSON.stringify(error)}`,
            );
            alert('アカウント登録に失敗しました');
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(`signInWithEmailでエラー: ${JSON.stringify(error)}`);
            alert('ログインに失敗しました');
        }
    };

    const signOut = async () => {
        await signOutFromFirebase(auth);
        router.replace('/');
    };

    const isAuthenticated = currentUser != null;

    return {
        isAuthenticated,
        currentUser,
        signUpWithEmail,
        signInWithEmail,
        signOut,
    };
};

export default useFirebaseAuth;
