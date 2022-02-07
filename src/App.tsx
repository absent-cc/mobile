/* eslint-disable no-nested-ternary */
import React from 'react';
import { registerRootComponent } from 'expo';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Inter_700Bold,
    Inter_400Regular,
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
import { APIProvider, useAPI } from './state/APIContext';
import ScheduleOnboarding from './pages/onboarding/ScheduleOnboarding';
import ProfileOnboarding from './pages/onboarding/ProfileOnboarding';

const Stack = createNativeStackNavigator();

function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });
    const appState = useAppState();
    const settings = useSettings();
    const api = useAPI();

    if (!(fontsLoaded && appState.ready && settings.ready && api.ready)) {
        return <AppLoading />;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
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
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

function AppContexts() {
    return (
        <SettingsProvider>
            <AppStateProvider>
                <APIProvider>
                    <App />
                </APIProvider>
            </AppStateProvider>
        </SettingsProvider>
    );
}

export default registerRootComponent(AppContexts);
