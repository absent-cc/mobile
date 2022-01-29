import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../api/APITypes';

export type AppSettings = {
    showFreeBlocks: boolean;
    sendNotifications: boolean;
    sendNoAbsenceNotification: boolean;
};

export type SettingsType = {
    app: AppSettings;
    user?: UserSettings;
};

export type SettingsContextType = {
    ready: boolean;
    value: SettingsType;
    resetSettings: () => void;
    setSettings: (
        setterFunction: (settings: SettingsType) => Partial<SettingsType>,
    ) => void;
};

// Default settings
export const defaultState: SettingsType = {
    app: {
        showFreeBlocks: true,
        sendNotifications: true,
        sendNoAbsenceNotification: true,
    },
};

// Transform to new settings schema
export function settingsTransformer(oldSettings: any): SettingsType {
    console.log('Running settings transformer');

    return oldSettings;
}

const SettingsContext = React.createContext<SettingsContextType>({
    ready: false,
    value: defaultState,
    resetSettings: () => {},
    setSettings: () => {},
});

export function SettingsProvider(props: any) {
    const [settings, setSettings] = React.useState<SettingsType>(defaultState);
    const [ready, setReady] = React.useState(false);

    // Save and read state
    React.useEffect(() => {
        const run = async () => {
            if (!ready) {
                // Read state
                const savedSettingsString = await AsyncStorage.getItem(
                    'settings',
                );
                if (savedSettingsString) {
                    let savedSettings;

                    try {
                        savedSettings = JSON.parse(savedSettingsString);

                        savedSettings = settingsTransformer(savedSettings);
                    } catch (e) {
                        savedSettings = {};
                    }

                    setSettings({
                        ...defaultState,
                        ...savedSettings,
                    });
                } else {
                    setSettings({
                        ...defaultState,
                    });
                }

                setReady(true);
            } else {
                // Save state
                const settingsString = JSON.stringify(settings);
                await AsyncStorage.setItem('settings', settingsString);
            }
        };

        run();
    }, [settings]);

    // Memoized just in case
    const resetSettings = React.useMemo(() => {
        return () => {
            setSettings({
                ...defaultState,
            });
        };
    }, [setSettings]);

    const settingsProp = {
        value: settings,
        ready,
        resetSettings,
        setSettings,
    };

    return <SettingsContext.Provider {...props} value={settingsProp} />;
}

export function useSettings() {
    return React.useContext(SettingsContext);
}
