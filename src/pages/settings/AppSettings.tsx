import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import SwitchField from '../../components/input/Switch';
import HeaderSafearea from '../../components/header/HeaderSafearea';
import { useSettings } from '../../state/SettingsContext';

function AppSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const { value: settingsValue, setSettings } = useSettings();
    const [appSettings, setAppSettings] = React.useState(settingsValue.app);

    // autosave app settings
    React.useEffect(() => {
        setSettings((oldSettings) => ({
            ...oldSettings,
            app: appSettings,
        }));
    }, [appSettings, setSettings]);

    return (
        <View style={styles.pageView}>
            <HeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
                keyboardShouldPersistTaps="handled"
            >
                <Header
                    iconName="chevron-left"
                    iconClick={() => {
                        navigation.goBack();
                    }}
                    isLeft
                    text="App Options"
                />
                <View style={styles.content}>
                    <Text style={styles.note}>Edit app options.</Text>
                    <SwitchField
                        style={styles.inputField}
                        label="Show free blocks as absent teachers"
                        onChange={(newValue: boolean) => {
                            setAppSettings((oldSettings) => ({
                                ...oldSettings,
                                showFreeBlocks: newValue,
                            }));
                        }}
                        defaultValue={appSettings.showFreeBlocks}
                    />

                    <SwitchField
                        style={styles.inputField}
                        label="Send notifications"
                        onChange={(newValue: boolean) => {
                            setAppSettings((oldSettings) => ({
                                ...oldSettings,
                                sendNotifications: newValue,
                            }));
                        }}
                        defaultValue={appSettings.sendNotifications}
                    />

                    <SwitchField
                        style={styles.inputField}
                        label="Send notification even if no teachers are absent"
                        onChange={(newValue: boolean) => {
                            setAppSettings((oldSettings) => ({
                                ...oldSettings,
                                sendNoAbsenceNotification: newValue,
                            }));
                        }}
                        defaultValue={appSettings.sendNoAbsenceNotification}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    content: {
        paddingHorizontal: 30,
        paddingTop: 5,
        paddingBottom: 300,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 16,
        marginBottom: 16,
    },
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
});

export default AppSettings;
