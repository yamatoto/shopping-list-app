module.exports = ({ config }) => {
    return {
        ...config,
        android: {
            package: 'com.yamato.shoppinglistapp',
            googleServicesFile: './google-services.json',
            config: {
                googleSignIn: {
                    apiKey: process.env.EXPO_PUBLIC_ANDROID_API_KEY,
                    certificateHash:
                        process.env.EXPO_PUBLIC_GOOGLE_CERTIFICATE_HASH,
                },
            },
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
        },
        extra: {
            googleClientIdAndroid:
                process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
            googleClientIdIOS: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
            router: {
                origin: false,
            },
            eas: {
                projectId: '90b6f1a0-eade-4388-9c0b-5b600c552c97',
            },
        },
    };
};
