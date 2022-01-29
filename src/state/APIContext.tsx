import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSettings } from './SettingsContext';
import { useAppState } from './AppStateContext';
import * as APIMethods from '../api/APIMethods';

export interface APIDataType {
    token: string | null;
}

export interface APIContextType {
    ready: boolean;
    fetchAbsences: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    logout: () => Promise<void>;
}

const APIContext = React.createContext<APIContextType>({
    ready: false,
    fetchAbsences: async () => {},
    fetchSettings: async () => {},
    logout: async () => {},
});

const defaultState: APIDataType = {
    token: null,
};

export function APIProvider(props: any) {
    const [apiSettings, setAPISettings] =
        React.useState<APIDataType>(defaultState);
    const [ready, setReady] = React.useState(false);

    const settings = useSettings();
    const appState = useAppState();

    // Save and read state
    React.useEffect(() => {
        const run = async () => {
            if (!ready) {
                // Read state
                const savedSettingsString = await SecureStore.getItemAsync(
                    'apisettings',
                );
                if (savedSettingsString) {
                    let savedSettings;

                    try {
                        savedSettings = JSON.parse(savedSettingsString);
                    } catch (e) {
                        savedSettings = {};
                    }

                    setAPISettings({
                        ...defaultState,
                        ...savedSettings,
                    });
                } else {
                    setAPISettings({
                        ...defaultState,
                    });
                }
                setReady(true);
            } else {
                // Save state
                const settingsString = JSON.stringify(apiSettings);
                await SecureStore.setItemAsync('apisettings', settingsString);
            }

            // Once it's done, ask the server for an update
            if (apiSettings.token !== null) {
                fetchAbsences();
                fetchSettings();
            }
        };

        run();
    }, [apiSettings]);

    const fetchAbsences = async () => {
        // sample api return
        const response = {};

        appState.setAppState((oldState) => {
            return {
                ...oldState,
                absences: response,
            };
        });
    };

    const fetchSettings = async () => {
        if (apiSettings.token === null) return;

        const response = await APIMethods.fetchSettings(apiSettings.token);

        settings.setSettings((oldSettings) => {
            return {
                ...oldSettings,
                user: response,
            };
        });
    };
    const logout = async () => {
        if (apiSettings.token !== null) {
            await APIMethods.logout(apiSettings.token);
        }

        settings.resetSettings();
        appState.setAppState((oldState) => {
            return {
                ...oldState,
                isLoggedIn: false,
            };
        });
    };

    const searchTeachers = async (searchString: string) => {
        if (apiSettings.token === null) return;

        return await APIMethods.searchTeachers(searchString, apiSettings.token);
    };

    const settingsProp = {
        ready,
        fetchAbsences,
        fetchSettings,
        logout,
    };

    return <APIContext.Provider {...props} value={settingsProp} />;
}

export function useAPI() {
    return React.useContext(APIContext);
}
