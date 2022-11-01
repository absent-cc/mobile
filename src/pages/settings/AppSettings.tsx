import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwitchField from '../../components/input/Switch';
import { useSettings } from '../../state/SettingsContext';
import TextButton from '../../components/button/TextButton';
import LoadingCard from '../../components/card/LoadingCard';
import ErrorCard from '../../components/card/ErrorCard';
import { useAPI } from '../../api/APIContext';
import WithHeader from '../../components/header/WithHeader';
import { useTheme } from '../../theme/ThemeContext';
import { ThemeList } from '../../theme/Themes';
import Dropdown from '../../components/input/Dropdown';

function AppSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const api = useAPI();
    const settings = useSettings();
    const { Theme, themeState, setThemeState } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                pageView: {
                    flex: 1,
                    width: '100%',
                    backgroundColor: Theme.backgroundColor,
                },
                note: {
                    color: Theme.foregroundColor,
                    fontFamily: Theme.regularFont,
                    fontSize: 18,
                    // marginBottom: 16,
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
                saveValidation: {
                    marginBottom: 20,
                },
                savePanel: {
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: Theme.backgroundColor,
                    padding: 20,
                    borderTopWidth: 2,
                    borderColor: Theme.lightForeground,
                },
                sectionHeader: {
                    color: Theme.foregroundColor,
                    fontFamily: Theme.strongFont,
                    fontSize: 28,
                    marginBottom: 8,
                    marginTop: 24,
                },
            }),
        [Theme],
    );

    // TODO: change this to be a deep copy someday for safety
    const defaultValue = { ...settings.value.app };
    const appSettings = React.useRef(defaultValue);
    const themeStateChanges = React.useRef(themeState);

    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

    const { navigate } = navigation;
    React.useEffect(() => {
        if (saving) {
            setThemeState(themeStateChanges.current);
            api.saveAppSettings(appSettings.current)
                .then(() => {
                    hasUnsavedChanges.current = false;
                    navigate('Settings');
                })
                .catch(() => {
                    setSaveError(true);
                });
        }
    }, [saving, api, navigate, setThemeState]);

    // reset screen on exit
    // React.useEffect(() => {
    //     return () => {
    //         appSettings.current = defaultValue;
    //     };
    // });

    // prevent leaving without saving
    const hasUnsavedChanges = React.useRef(false);
    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e: any) => {
                if (!hasUnsavedChanges.current) {
                    return;
                }

                // Prevent leaving screen
                e.preventDefault();

                Alert.alert(
                    'Unsaved changes',
                    'You have unsaved changes. Are you sure you want to discard them?',
                    [
                        {
                            text: 'Stay',
                            style: 'cancel',
                            onPress: () => undefined,
                        },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ],
                );
            }),
        [navigation],
    );

    return (
        <WithHeader
            style={styles.pageView}
            iconName="chevron-left"
            iconClick={() => {
                navigation.goBack();
            }}
            isLeft
            text="App Options"
            largeBottom
            footer={
                <View
                    style={[
                        styles.savePanel,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                >
                    {saving ? (
                        <LoadingCard style={[styles.saveValidation]}>
                            Saving...
                        </LoadingCard>
                    ) : null}
                    {saveError ? (
                        <ErrorCard style={[styles.saveValidation]}>
                            There was a problem while saving your information.
                            Please try again.
                        </ErrorCard>
                    ) : null}
                    <TextButton
                        style={[{ zIndex: 1 }]}
                        iconName="save"
                        onPress={() => {
                            setSaving(true);
                        }}
                        isFilled
                    >
                        Save
                    </TextButton>
                </View>
            }
        >
            <Text style={styles.note}>Edit app options.</Text>
            <Text style={styles.sectionHeader}>Behavior</Text>
            <SwitchField
                style={styles.inputField}
                label="Show free blocks as absent teachers"
                onChange={(newValue: boolean) => {
                    // setAppSettings((oldSettings) => ({
                    //     ...oldSettings,
                    //     showFreeBlocks: newValue,
                    // }));
                    hasUnsavedChanges.current = true;
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
                    hasUnsavedChanges.current = true;
                    appSettings.current.sendNotifications = newValue;
                }}
                defaultValue={appSettings.current.sendNotifications}
            />

            <SwitchField
                style={styles.inputField}
                label="Send notifications even if no teachers are absent"
                onChange={(newValue: boolean) => {
                    // setAppSettings((oldSettings) => ({
                    //     ...oldSettings,
                    //     sendNoAbsenceNotification: newValue,
                    // }));
                    hasUnsavedChanges.current = true;
                    appSettings.current.sendNoAbsenceNotification = newValue;
                }}
                defaultValue={appSettings.current.sendNoAbsenceNotification}
            />

            <Text style={styles.sectionHeader}>Appearance</Text>

            <Dropdown
                label="Theme"
                onChange={(newValue: number) => {
                    hasUnsavedChanges.current = true;
                    themeStateChanges.current.theme = ThemeList[newValue];
                }}
                style={[styles.inputField, { zIndex: 1 }]}
                placeholder="Select a backend"
                options={['Use System Theme', 'Light', 'Dark']}
                defaultValue={ThemeList.indexOf(
                    themeStateChanges.current.theme,
                )}
            />
            <SwitchField
                style={[styles.inputField, { zIndex: 0 }]}
                label="Enable seasonal themes"
                onChange={(newValue: boolean) => {
                    hasUnsavedChanges.current = true;
                    themeStateChanges.current.allowSeasonal = newValue;
                }}
                defaultValue={themeStateChanges.current.allowSeasonal}
            />
        </WithHeader>
    );
}

export default AppSettings;
