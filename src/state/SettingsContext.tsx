import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schedule, UserSettings } from '../api/APITypes';
import { DefaultAppSettings, EmptySchedule, EmptyUser } from '../Utils';
import { useDialog } from '../components/dialog/Dialog';
import ErrorDialog from '../components/dialog/ErrorDialog';

export type AppSettings = {
    showFreeBlocks: boolean;
    sendNotifications: boolean;
    sendNoAbsenceNotification: boolean;
};

export type SettingsType = {
    ready: boolean;
    serverLoaded: boolean;
    userOnboarded: boolean;
    uid: string;
    app: AppSettings;
    user: UserSettings;
    schedule: Schedule;
};

export type SettingsContextType = {
    value: SettingsType;
    resetSettings: () => void;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
};

// Default settings
export const defaultState: SettingsType = {
    ready: false,
    serverLoaded: false,
    userOnboarded: false,
    uid: '',
    app: DefaultAppSettings,
    user: EmptyUser,
    schedule: EmptySchedule,
};

// Transform to new settings schema
export function settingsTransformer(oldSettings: any): SettingsType {
    return oldSettings;
}

const SettingsContext = React.createContext<SettingsContextType>({
    value: defaultState,
    resetSettings: () => undefined,
    setSettings: () => undefined,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = React.useState<SettingsType>(defaultState);
    const { open: openDialog, close: closeDialog } = useDialog();

    // read token only once
    React.useEffect(() => {
        AsyncStorage.getItem('appsettings')
            .then((savedSettingsString) => {
                return savedSettingsString
                    ? JSON.parse(savedSettingsString)
                    : {};
            })
            .then((savedSettings) => {
                setSettings((oldSettings) => ({
                    ...oldSettings,
                    ready: true,
                    app: savedSettings,
                }));
            })
            .catch(() => {
                setSettings((oldSettings) => ({
                    ...oldSettings,
                    ready: true,
                }));
            });
    }, []);

    // save token on change
    React.useEffect(() => {
        if (settings.ready) {
            const settingsString = JSON.stringify(settings.app);
            AsyncStorage.setItem('appsettings', settingsString).catch((e) => {
                openDialog(
                    <ErrorDialog
                        message="An unknown error occurred while saving your app settings."
                        description={e.message}
                        caller="Saving app settings"
                        close={closeDialog}
                    />,
                );
            });
        }
    }, [settings, openDialog, closeDialog]);

    const resetSettings = React.useCallback(() => {
        setSettings({
            ...defaultState,
        });
    }, [setSettings]);

    const settingsProp: SettingsContextType = React.useMemo(
        () => ({
            value: settings,
            resetSettings,
            setSettings,
        }),
        [settings, resetSettings],
    );

    return (
        <SettingsContext.Provider value={settingsProp}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return React.useContext(SettingsContext);
}
