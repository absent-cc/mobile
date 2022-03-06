/* eslint-disable no-nested-ternary */
import React from 'react';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Inter_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

const Stack = createNativeStackNavigator();

function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Inter_600SemiBold,
        // eslint-disable-next-line global-require, import/extensions
        Inter_Display_600SemiBold: require('../assets/fonts/InterDisplay-SemiBold.otf'),
    });
    const appState = useAppState();
    const settings = useSettings();
    const api = useAPI();
    const dialog = useDialog();

    // first, wait for everything to load from local
    if (!fontsLoaded || !api.ready || !settings.value.ready) {
        return <AppLoading />;
    }

    // then, if we are logged in, wait for a server update
    if (
        api.isLoggedIn &&
        (!appState.value.serverLoaded || !settings.value.serverLoaded)
    ) {
        return <Loading />;
    }

    return (
        <>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                }}
            >
                {api.isLoggedIn ? (
                    settings.value.userOnboarded ? (
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
            {dialog.displayer}
        </>
    );
}

export default function AppRoot() {
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
