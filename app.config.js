module.exports = ({ config }) => {
    return {
        ...config,
        updates: {
            url: 'https://u.expo.dev/90b6f1a0-eade-4388-9c0b-5b600c552c97',
        },
        runtimeVersion: {
            policy: 'appVersion',
        },
        android: {
            package: 'com.yamato.shoppinglistapp',
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
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
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.yamato.shoppinglistapp',
            googleServicesFile: process.env.GOOGLE_SERVICE_INFO_JSON,
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
