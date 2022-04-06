import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Theme from '../../Theme';
import SwitchField from '../../components/input/Switch';
import { useSettings } from '../../state/SettingsContext';
import TextButton from '../../components/button/TextButton';
import LoadingCard from '../../components/card/LoadingCard';
import ErrorCard from '../../components/card/ErrorCard';
import { useAPI } from '../../api/APIContext';
import WithHeader from '../../components/header/WithHeader';

function AppSettings({ navigation }: { navigation: any }) {
    const api = useAPI();
    const settings = useSettings();

    // TODO: change this to be a deep copy someday for safety
    const defaultValue = { ...settings.value.app };
    const appSettings = React.useRef(defaultValue);

    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

    const { navigate } = navigation;
    React.useEffect(() => {
        if (saving) {
            api.saveAppSettings(appSettings.current)
                .then(() => {
                    navigate('Settings');
                })
                .catch(() => {
                    setSaveError(true);
                });
        }
    }, [saving, api, navigate]);

    // reset screen on exit
    // React.useEffect(() => {
    //     return () => {
    //         appSettings.current = defaultValue;
    //     };
    // });

    return (
        <WithHeader
            style={styles.pageView}
            iconName="chevron-left"
            iconClick={() => {
                navigation.goBack();
            }}
            isLeft
            text="App Options"
        >
            <Text style={styles.note}>Edit app options.</Text>
            <SwitchField
                style={styles.inputField}
                label="Show free blocks as absent teachers"
                onChange={(newValue: boolean) => {
                    // setAppSettings((oldSettings) => ({
                    //     ...oldSettings,
                    //     showFreeBlocks: newValue,
                    // }));
                    appSettings.current.showFreeBlocks = newValue;
                }}
                defaultValue={appSettings.current.showFreeBlocks}
            />

            <SwitchField
                style={styles.inputField}
                label="Send notifications"
                onChange={(newValue: boolean) => {
                    // setAppSettings((oldSettings) => ({
                    //     ...oldSettings,
                    //     sendNotifications: newValue,
                    // }));
                    appSettings.current.sendNotifications = newValue;
                }}
                defaultValue={appSettings.current.sendNotifications}
            />

            <SwitchField
                style={styles.inputField}
                label="Send notification even if no teachers are absent"
                onChange={(newValue: boolean) => {
                    // setAppSettings((oldSettings) => ({
                    //     ...oldSettings,
                    //     sendNoAbsenceNotification: newValue,
                    // }));
                    appSettings.current.sendNoAbsenceNotification = newValue;
                }}
                defaultValue={appSettings.current.sendNoAbsenceNotification}
            />

            {saving ? (
                <LoadingCard style={[styles.validation]}>Saving...</LoadingCard>
            ) : null}
            {saveError ? (
                <ErrorCard style={[styles.validation]}>
                    There was a problem while saving your information. Please
                    try again.
                </ErrorCard>
            ) : null}
            <TextButton
                style={[{ zIndex: 1 }, styles.save]}
                iconName="save"
                onPress={() => {
                    setSaving(true);
                }}
                isFilled
            >
                Save
            </TextButton>
        </WithHeader>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 18,
        marginBottom: 16,
    },
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
    save: {
        marginTop: 40,
    },
    validation: {
        marginVertical: 20,
    },
});

export default AppSettings;
