import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSettings } from './SettingsContext';
import { useAppState } from './AppStateContext';
import * as APIMethods from '../api/APIMethods';
import { Block, Teacher } from '../api/APITypes';

export interface APIDataType {
    token: string | null;
}

export interface APIContextType {
    ready: boolean;
    fetchAbsences: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    logout: () => Promise<void>;
    login: () => Promise<void>;
    searchTeachers: (searchString: string) => Promise<Teacher[]>;
    getClassesToday: () => Promise<Block[]>;
}

const APIContext = React.createContext<APIContextType>({
    ready: false,
    fetchAbsences: async () => {
        // default empty
    },
    fetchSettings: async () => {
        // default empty
    },
    logout: async () => {
        // default empty
    },
    login: async () => {
        // default empty
    },
    searchTeachers: async () => {
        return [];
    },
    getClassesToday: async () => {
        return [];
    },
});

const defaultState: APIDataType = {
    token: null,
};

export function APIProvider({ children }: { children: React.ReactNode }) {
    const [apiSettings, setAPISettings] =
        React.useState<APIDataType>(defaultState);
    const [ready, setReady] = React.useState(false);

    const { setSettings, resetSettings } = useSettings();
    const { setAppState } = useAppState();

    const fetchAbsences = React.useMemo(
        () => async () => {
            if (apiSettings.token === null) return;

            const response = await APIMethods.fetchAbsences(apiSettings.token);

            setAppState((oldState) => {
                return {
                    ...oldState,
                    absences: response,
                };
            });
        },
        [setAppState, apiSettings.token],
    );

    const fetchSettings = React.useMemo(
        () => async () => {
            if (apiSettings.token === null) return;

            const response = await APIMethods.fetchSettings(apiSettings.token);

            setSettings((oldSettings) => {
                return {
                    ...oldSettings,
                    user: response,
                };
            });
        },
        [apiSettings.token, setSettings],
    );

    const logout = React.useMemo(
        () => async () => {
            if (apiSettings.token !== null) {
                await APIMethods.logout(apiSettings.token);
            }

            resetSettings();
            setAppState((oldState) => {
                return {
                    ...oldState,
                    isLoggedIn: false,
                };
            });
        },
        [apiSettings.token, resetSettings, setAppState],
    );

    const searchTeachers = React.useMemo(
        () =>
            async (searchString: string): Promise<Teacher[]> => {
                if (apiSettings.token === null) return [];

                return APIMethods.searchTeachers(
                    searchString,
                    apiSettings.token,
                );
            },
        [apiSettings.token],
    );

    const getClassesToday = React.useMemo(
        () => async (): Promise<Block[]> => {
            if (apiSettings.token === null) return [];

            return APIMethods.getClassesToday(apiSettings.token);
        },
        [apiSettings.token],
    );

    const login = React.useMemo(
        () => async () => {
            const token = await APIMethods.login();
            setAPISettings((oldState) => {
                return {
                    ...oldState,
                    token,
                };
            });
        },
        [],
    );

    // Save and read token
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
    }, [apiSettings, ready, fetchAbsences, fetchSettings]);

    const settingsProp: APIContextType = React.useMemo(
        () => ({
            ready,
            fetchAbsences,
            fetchSettings,
            logout,
            login,
            searchTeachers,
            getClassesToday,
        }),
        [
            ready,
            fetchAbsences,
            fetchSettings,
            logout,
            login,
            searchTeachers,
            getClassesToday,
        ],
    );

    return (
        <APIContext.Provider value={settingsProp}>
            {children}
        </APIContext.Provider>
    );
}

export function useAPI() {
    return React.useContext(APIContext);
}
