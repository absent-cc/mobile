import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import TextButton from '../../components/button/TextButton';
import { useAPI } from '../../api/APIContext';
import WithHeader from '../../components/header/WithHeader';
import Dropdown from '../../components/input/Dropdown';

function DeveloperSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const { backend: selectedBackend, switchBackend } = useAPI();

    const defaultValue = { backend: selectedBackend };
    const settings = React.useRef(defaultValue);

    const [saving, setSaving] = React.useState(false);

    const { goBack } = navigation;
    React.useEffect(() => {
        if (saving && settings.current.backend !== selectedBackend) {
            switchBackend(settings.current.backend);
            hasUnsavedChanges.current = false;
            goBack();
        }
    }, [saving, switchBackend, selectedBackend, goBack]);

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
            text="Developer"
            footer={
                <View
                    style={[
                        styles.savePanel,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                >
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
            <Text style={styles.note}>Top secret developer settings...</Text>
            <Dropdown
                label="Select backend"
                onChange={(newValue: number) => {
                    settings.current.backend = newValue;
                    hasUnsavedChanges.current = true;
                }}
                style={[styles.inputField, { zIndex: 2 }]}
                placeholder="Select a backend"
                options={[
                    'Production (api.absent.cc)',
                    'Development (dev.api.absent.cc)',
                ]}
                defaultValue={settings.current.backend}
            />
            <Text style={[styles.note2]}>
                Note: Switching backends will log you out.
            </Text>
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
    note2: {
        color: Theme.darkForeground,
        fontFamily: Theme.italicFont,
        fontSize: 18,
        marginBottom: 16,
        marginTop: 10,
        marginHorizontal: 20,
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
});

export default DeveloperSettings;
