import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { registerRootComponent } from 'expo';
import Welcome from './pages/Welcome';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Inter_700Bold,
    Inter_400Regular,
} from '@expo-google-fonts/inter';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppSettings from './pages/settings/AppSettings';
import GeneralSettings from './pages/settings/GeneralSettings';
import TeacherSettings from './pages/settings/TeacherSettings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function App() {
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Welcome"
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen name="Welcome" component={Welcome} />
                        <Stack.Screen
                            name="Onboarding"
                            component={Onboarding}
                        />
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Settings" component={Settings} />
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
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default registerRootComponent(App);
