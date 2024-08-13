import { initializeApp } from 'firebase/app';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import 'firebase/firestore';
import { FirebaseOptions } from '@firebase/app';
import Constants from 'expo-constants';

const IOS_API_KEY = process.env.EXPO_PUBLIC_IOS_API_KEY ?? '';
const ANDROID_API_KEY = process.env.EXPO_PUBLIC_ANDROID_API_KEY ?? '';
const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID ?? '';
const MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID ?? '';
const IOS_APP_ID = process.env.EXPO_PUBLIC_IOS_APP_ID ?? '';
const ANDROID_APP_ID = process.env.EXPO_PUBLIC_ANDROID_APP_ID ?? '';
const MEASUREMENT_ID = process.env.EXPO_PUBLIC_MEASUREMENT_ID ?? '';
export const GOOGLE_ANDROID_CLIENT_ID =
    Constants.expoConfig?.extra?.googleClientIdAndroid ||
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
export const GOOGLE_IOS_CLIENT_ID =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
export const GOOGLE_WEB_CLIENT_ID =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

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

// TODO: この辺不要かも
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
