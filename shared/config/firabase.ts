import { initializeApp, FirebaseOptions } from 'firebase/app';
import {
    initializeAuth,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from '@firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const IOS_API_KEY = process.env.EXPO_PUBLIC_IOS_API_KEY ?? '';
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_ANDROID_API_KEY ?? '';
const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID ?? '';
const MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID ?? '';
const IOS_APP_ID = process.env.EXPO_PUBLIC_IOS_APP_ID ?? '';
const ANDROID_APP_ID = process.env.EXPO_PUBLIC_ANDROID_APP_ID ?? '';
const MEASUREMENT_ID = process.env.EXPO_PUBLIC_MEASUREMENT_ID ?? '';

const firebaseConfig: FirebaseOptions = {
    ...(Platform.OS === 'ios'
        ? {
              apiKey: IOS_API_KEY,
              appId: IOS_APP_ID,
          }
        : {
              apiKey: ANDROID_API_KEY,
              appId: ANDROID_APP_ID,
          }),
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
    projectId: PROJECT_ID,
    storageBucket: `${PROJECT_ID}.appspot.com`,
    messagingSenderId: MESSAGING_SENDER_ID,
    measurementId: MEASUREMENT_ID,
};
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseApp = initializeApp(firebaseConfig);
initializeAuth(firebaseApp, {
    persistence: reactNativePersistence(ReactNativeAsyncStorage),
});
const auth = getAuth();

const db = getFirestore(firebaseApp);

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    db,
};
