/* eslint-disable no-nested-ternary */
import React from 'react';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Inter_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import messaging from '@react-native-firebase/messaging';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Settings from './pages/Settings';
import AppSettings from './pages/settings/AppSettings';
import GeneralSettings from './pages/settings/GeneralSettings';
import TeacherSettings from './pages/settings/TeacherSettings';
import { AppStateProvider, useAppState } from './state/AppStateContext';
import { SettingsProvider, useSettings } from './state/SettingsContext';
import { APIProvider, useAPI } from './api/APIContext';
import ScheduleOnboarding from './pages/onboarding/ScheduleOnboarding';
import ProfileOnboarding from './pages/onboarding/ProfileOnboarding';
import FullList from './pages/FullList';
import Loading from './pages/Loading';
import { Dialog, useDialog } from './components/dialog/Dialog';
import ErrorBoundary from './components/ErrorBoundary';
import UpdateDialog from './components/dialog/UpdateDialog';
import ErrorDialog from './components/dialog/ErrorDialog';
// import WelcomeLoading from './pages/WelcomeLoading';

const Stack = createNativeStackNavigator();

function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_600SemiBold,
        RobotoMono_400Regular,
        // eslint-disable-next-line global-require, import/extensions
        Inter_Display_600SemiBold: require('../assets/fonts/InterDisplay-SemiBold.otf'),
    });
    const appState = useAppState();
    const { value: settings } = useSettings();
    const { ready: apiReady, isLoggedIn, saveFCMToken } = useAPI();
    const {
        displayer: dialogDisplayer,
        open: openDialog,
        close: closeDialog,
    } = useDialog();

    React.useEffect(() => {
        if (isLoggedIn) {
            // console.log('Uploading messaging token.');
            messaging()
                .getToken()
                .then((token: string) => {
                    if (token && token.length > 0) return saveFCMToken(token);
                    return undefined;
                })
                .catch((error: any) => {
                    openDialog(
                        <ErrorDialog
                            message="Sorry, there was an unknown error. Please try again."
                            description={error.message || ''}
                            caller="Request FCM Token"
                            close={closeDialog}
                            lightVersion
                        />,
                    );
                });

            return messaging().onTokenRefresh((token) => {
                // console.log('Uploading messaging token from listener.');
                saveFCMToken(token);
            });
        }
        return () => undefined;
    }, [saveFCMToken, isLoggedIn, openDialog, closeDialog]);

    React.useEffect(() => {
        return Updates.addListener((e) => {
            if (e.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
                openDialog(<UpdateDialog close={closeDialog} />);
            }
        });
    }, [openDialog, closeDialog]);

    // first, wait for everything to load from local
    if (!fontsLoaded || !apiReady) {
        return <AppLoading />;
    }

    // then, if we are logged in, wait for a server update
    if (isLoggedIn) {
        // app state only loads once the user onboards
        if (settings.userOnboarded) {
            if (!appState.value.serverLoaded || !settings.serverLoaded) {
                return <Loading />;
            }
        } else if (!settings.serverLoaded) {
            return <Loading />;
        }
    }

    // let navigationContent;
    // if (
    //     isLoggedIn &&
    //     (!appState.value.serverLoaded || !settings.serverLoaded)
    // ) {
    //     <Stack.Screen name="Loading" component={WelcomeLoading} />;
    // } else if (isLoggedIn) {
    //     if (settings.userOnboarded) {
    //         // navigationContent = (
    //         //     <>
    //         //         <Stack.Screen name="Home" component={Home} />
    //         //         <Stack.Screen name="FullList" component={FullList} />
    //         //         <Stack.Screen name="Settings" component={Settings} />
    //         //         <Stack.Screen
    //         //             name="GeneralSettings"
    //         //             component={GeneralSettings}
    //         //         />
    //         //         <Stack.Screen name="AppSettings" component={AppSettings} />
    //         //         <Stack.Screen
    //         //             name="TeacherSettings"
    //         //             component={TeacherSettings}
    //         //         />
    //         //     </>
    //         // );
    //         navigationContent = <Stack.Screen name="Home" component={Home} />;
    //     } else {
    //         navigationContent = (
    //             <>
    //                 <Stack.Screen
    //                     name="ProfileOnboarding"
    //                     component={ProfileOnboarding}
    //                 />
    //                 <Stack.Screen
    //                     name="ScheduleOnboarding"
    //                     component={ScheduleOnboarding}
    //                 />
    //             </>
    //         );
    //     }
    // } else {
    //     navigationContent = <Stack.Screen name="Welcome" component={Welcome} />;
    // }

    // console.log(navigationContent);

    return (
        <>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                }}
            >
                {isLoggedIn ? (
                    settings.userOnboarded ? (
                        <>
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen
                                name="FullList"
                                component={FullList}
                            />
                            <Stack.Screen
                                name="Settings"
                                component={Settings}
                            />
                            <Stack.Screen
                                name="GeneralSettings"
                                component={GeneralSettings}
                            />
                            <Stack.Screen
                                name="AppSettings"
                                component={AppSettings}
                            />
                            <Stack.Screen
                                name="TeacherSettings"
                                component={TeacherSettings}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen
                                name="ProfileOnboarding"
                                component={ProfileOnboarding}
                            />
                            <Stack.Screen
                                name="ScheduleOnboarding"
                                component={ScheduleOnboarding}
                            />
                        </>
                    )
                ) : (
                    <Stack.Screen name="Welcome" component={Welcome} />
                )}
            </Stack.Navigator>
            {dialogDisplayer}
        </>
    );
}

export default function AppRoot() {
    // app state will be null for a bit
    // if (AppState.currentState === null) {
    //     return <AppLoading />;
    // }

    // // headless mode for firebase notifications in ios
    // if (AppState.currentState !== 'active') {
    //     return null;
    // }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <ErrorBoundary>
                    <Dialog>
                        <SettingsProvider>
                            <AppStateProvider>
                                <APIProvider>
                                    <App />
                                </APIProvider>
                            </AppStateProvider>
                        </SettingsProvider>
                    </Dialog>
                </ErrorBoundary>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
