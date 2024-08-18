module.exports = ({ config }) => {
    return {
        ...config,
        updates: {
            url: 'https://u.expo.dev/90b6f1a0-eade-4388-9c0b-5b600c552c97',
            fallbackToCacheTimeout: 0,
            channel: 'production',
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
                    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
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
            googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST,
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
