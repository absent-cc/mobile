import React from 'react';
import { Schedule, UserSettings } from '../api/APITypes';
import { DefaultAppSettings, EmptySchedule, EmptyUser } from '../Utils';

export type AppSettings = {
    showFreeBlocks: boolean;
    sendNotifications: boolean;
    sendNoAbsenceNotification: boolean;
};

export type SettingsType = {
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

    // Memoized just in case
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
