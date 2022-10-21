const IS_DEV = process.env.APP_VARIANT === 'development';

const appVersion = '2.1.0';
const androidVersion = 6;

module.exports = {
    name: IS_DEV ? 'abSENT (Dev)' : 'abSENT',
    owner: 'absent',
    slug: 'absent',
    version: appVersion,
    scheme: 'absent',
    plugins: [
        '@notifee/react-native',
        'expo-dev-client',
        'expo-splash-screen',
        '@react-native-firebase/app',
        'expo-updates',
        [
            'expo-build-properties',
            {
                android: {
                    compileSdkVersion: 31,
                    targetSdkVersion: 31,
                    buildToolsVersion: '31.0.0',
                },
                ios: {
                    useFrameworks: 'static',
                },
            },
        ],
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
    runtimeVersion: {
        policy: 'sdkVersion',
    },
    userInterfaceStyle: 'automatic',
    ios: {
        supportsTablet: true,
        bundleIdentifier: IS_DEV ? 'cc.absent.devclient' : 'cc.absent.client',
        icon: './assets/images/icon.png',
        infoPlist: {
            UIBackgroundModes: ['fetch', 'remote-notification'],
        },
        googleServicesFile: IS_DEV
            ? './google/dev/GoogleService-Info.plist'
            : './google/prod/GoogleService-Info.plist',
        entitlements: {
            'aps-environment': 'development',
        },
        buildNumber: appVersion,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive_icon.png',
            backgroundColor: '#FFFFFF',
        },
        googleServicesFile: IS_DEV
            ? './google/dev/google-services.json'
            : './google/prod/google-services.json',
        icon: './assets/images/icon.png',
        package: IS_DEV ? 'cc.absent.devclient' : 'cc.absent.client',
        versionCode: androidVersion,
    },
    web: {
        favicon: './assets/images/icon.png',
    },
    updates: {
        fallbackToCacheTimeout: 0,
        url: 'https://u.expo.dev/1f4bfaba-717d-42d1-b1e1-0fc723961a55',
    },
    // mods: {
    //     android: {
    //         projectBuildGradle: async (config) => {
    //             console.log(
    //                 '------------- MODIFYING ANDROID CONFIG -------------',
    //             );
    //             config.modResults.contents = config.modResults.contents.replace(
    //                 'compileSdkVersion = 30',
    //                 'compileSdkVersion = 31',
    //             );
    //             return config;
    //         },
    //     },
    // },
    extra: {
        isDevelopment: IS_DEV,
        eas: {
            projectId: '1f4bfaba-717d-42d1-b1e1-0fc723961a55',
        },
    },
};
