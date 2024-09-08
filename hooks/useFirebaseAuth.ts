import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as signOutFromFirebase,
} from '@/config/firabase';
import { YAMATO_EMAIL } from '@/config/user';

const useFirebaseAuth = () => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<{
        email: string;
        name: 'yamato' | 'miho';
    } | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const userName =
                    user.email === YAMATO_EMAIL ? 'yamato' : 'miho';
                setCurrentUser({
                    email: user.email!,
                    name: userName,
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
            console.error(`でエラー: ${JSON.stringify(error)}`);
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
