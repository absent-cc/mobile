import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Schedule, UserSettings } from '../api/APITypes';
import { DefaultAppSettings, EmptySchedule, EmptyUser } from '../Utils';

export type AppSettings = {
    showFreeBlocks: boolean;
    sendNotifications: boolean;
    sendNoAbsenceNotification: boolean;
};

export type SettingsType = {
    userOnboarded: boolean;
    app: AppSettings;
    user: UserSettings;
    schedule: Schedule;
};

export type SettingsContextType = {
    ready: boolean;
    value: SettingsType;
    resetSettings: () => void;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
};

// Default settings
export const defaultState: SettingsType = {
    userOnboarded: false,
    app: DefaultAppSettings,
    user: EmptyUser,
    schedule: EmptySchedule,
};

// Transform to new settings schema
export function settingsTransformer(oldSettings: any): SettingsType {
    return oldSettings;
}

const SettingsContext = React.createContext<SettingsContextType>({
    ready: false,
    value: defaultState,
    resetSettings: () => {
        // default empty function
    },
    setSettings: () => {
        // default empty function
    },
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
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
    }, [settings, ready]);

    // Memoized just in case
    const resetSettings = React.useCallback(() => {
        setSettings({
            ...defaultState,
        });
    }, [setSettings]);

    const settingsProp: SettingsContextType = React.useMemo(
        () => ({
            value: settings,
            ready,
            resetSettings,
            setSettings,
        }),
        [ready, settings, resetSettings],
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
