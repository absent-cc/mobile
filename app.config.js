module.exports = {
    name: 'abSENT',
    owner: 'absent',
    slug: 'absent',
    version: '1.0.0',
    scheme: 'absent',
    plugins: [
        '@notifee/react-native',
        'expo-dev-client',
        'expo-splash-screen',
        '@react-native-firebase/app',
        'expo-updates',
    ],
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'cover',
        backgroundColor: '#ffffff',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'cc.absent.client',
        icon: './assets/images/icon.png',
        infoPlist: {
            UIBackgroundModes: ['fetch', 'remote-notification'],
        },
        googleServicesFile: './GoogleService-Info.plist',
        entitlements: {
            'aps-environment': 'development',
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive_icon.png',
            backgroundColor: '#FFFFFF',
        },
        googleServicesFile: './google-services.json',
        icon: './assets/images/icon.png',
        package: 'cc.absent.client',
    },
    web: {
        favicon: './assets/images/icon.png',
    },
    mods: {
        android: {
            projectBuildGradle: async (config) => {
                console.log(
                    '------------- MODIFYING ANDROID CONFIG -------------',
                );
                config.modResults.contents = config.modResults.contents.replace(
                    'compileSdkVersion = 30',
                    'compileSdkVersion = 31',
                );
                return config;
            },
        },
    },
};
