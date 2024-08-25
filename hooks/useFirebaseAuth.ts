import { useEffect, useState } from 'react';

import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from '@/config/firabase';

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
        await auth.signOut();
    };

    return {
        currentUserEmail,
        signUpWithEmail,
        signInWithEmail,
        signOut,
    };
};

export default useFirebaseAuth;
