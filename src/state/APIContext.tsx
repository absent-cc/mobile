import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSettings } from './SettingsContext';
import { useAppState } from './AppStateContext';
import * as APIMethods from '../api/APIMethods';
import { Block, EditingSchedule, Teacher, UserSettings } from '../api/APITypes';

export interface APIDataType {
    isLoggedIn: boolean;
    token: string | null;
}

export interface APIContextType {
    ready: boolean;
    isLoggedIn: boolean;
    fetchAbsences: () => Promise<void>;
    fetchSettings: () => Promise<void>;
    logout: () => Promise<void>;
    login: (accessToken: string) => Promise<void>;
    searchTeachers: (searchString: string) => Promise<Teacher[]>;
    getClassesToday: () => Promise<Block[]>;
    isRealTeacher: (partialName: string) => Promise<{
        isReal: boolean;
        similar: string[];
    }>;
    saveSettings: (newSettings: {
        user: UserSettings;
        schedule: EditingSchedule;
    }) => Promise<void>;
    saveSchedule: (newSettings: EditingSchedule) => Promise<void>;
    saveUserSettings: (newSettings: UserSettings) => Promise<void>;
}

const APIContext = React.createContext<APIContextType>({
    ready: false,
    isLoggedIn: false,
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
    isRealTeacher: async () => {
        return {
            isReal: false,
            similar: [],
        };
    },
    saveSettings: async () => {
        // default empty
    },
    saveSchedule: async () => {
        // default empty
    },
    saveUserSettings: async () => {
        // default empty
    },
});

const defaultState: APIDataType = {
    isLoggedIn: false,
    token: null,
};

export function APIProvider({ children }: { children: React.ReactNode }) {
    const [apiSettings, setAPISettings] =
        React.useState<APIDataType>(defaultState);
    const [ready, setReady] = React.useState(false);

    const { setSettings, resetSettings } = useSettings();
    const { setAppState } = useAppState();

    const fetchAbsences = React.useCallback(async () => {
        if (apiSettings.token === null) return;

        const response = await APIMethods.fetchAbsences(apiSettings.token);

        setAppState((oldState) => {
            return {
                ...oldState,
                absences: response,
            };
        });
    }, [setAppState, apiSettings.token]);

    const fetchSettings = React.useCallback(async () => {
        if (apiSettings.token === null) return;

        const response = await APIMethods.fetchSettings(apiSettings.token);

        setSettings((oldSettings) => {
            return {
                ...oldSettings,
                user: response.user,
                schedule: response.schedule,
            };
        });
    }, [apiSettings.token, setSettings]);

    const saveSettings = React.useCallback(
        async (newSettings: {
            user: UserSettings;
            schedule: EditingSchedule;
        }) => {
            if (apiSettings.token === null) return;

            const response = await APIMethods.saveSettings(
                newSettings,
                apiSettings.token,
            );

            setSettings((oldSettings) => {
                return {
                    ...oldSettings,
                    user: response.user,
                    schedule: response.schedule,
                };
            });
        },
        [apiSettings.token, setSettings],
    );

    const saveSchedule = React.useCallback(
        async (newSettings: EditingSchedule) => {
            if (apiSettings.token === null) return;

            const response = await APIMethods.saveSchedule(
                newSettings,
                apiSettings.token,
            );

            setSettings((oldSettings) => {
                return {
                    ...oldSettings,
                    schedule: response,
                };
            });
        },
        [apiSettings.token, setSettings],
    );

    const saveUserSettings = React.useCallback(
        async (newSettings: UserSettings) => {
            if (apiSettings.token === null) return;

            const response = await APIMethods.saveUserSettings(
                newSettings,
                apiSettings.token,
            );

            setSettings((oldSettings) => {
                return {
                    ...oldSettings,
                    user: response,
                };
            });
        },
        [apiSettings.token, setSettings],
    );

    const logout = React.useCallback(async () => {
        if (apiSettings.token !== null) {
            await APIMethods.logout(apiSettings.token);
        }

        resetSettings();
        setAPISettings((oldState) => {
            return {
                ...oldState,
                token: null,
                isLoggedIn: false,
            };
        });
    }, [apiSettings.token, resetSettings]);

    const searchTeachers = React.useCallback(
        async (searchString: string): Promise<Teacher[]> => {
            if (apiSettings.token === null) return [];

            return APIMethods.searchTeachers(searchString, apiSettings.token);
        },
        [apiSettings.token],
    );

    const isRealTeacher = React.useCallback(
        async (
            partialName: string,
        ): Promise<{
            isReal: boolean;
            similar: string[];
        }> => {
            if (apiSettings.token === null)
                return {
                    isReal: false,
                    similar: [],
                };

            return APIMethods.isRealTeacher(partialName, apiSettings.token);
        },
        [apiSettings.token],
    );

    const getClassesToday = React.useCallback(async (): Promise<Block[]> => {
        if (apiSettings.token === null) return [];

        return APIMethods.getClassesToday(apiSettings.token);
    }, [apiSettings.token]);

    const login = React.useCallback(async (accessToken: string) => {
        const token = await APIMethods.login(accessToken);
        setAPISettings((oldState) => {
            return {
                ...oldState,
                token,
            };
        });
    }, []);

    // Save and read token
    React.useEffect(() => {
        const run = async () => {
            if (!ready) {
                // Read state
                try {
                    const savedSettingsString = await SecureStore.getItemAsync(
                        'apisettings',
                    );

                    const savedSettings = savedSettingsString
                        ? JSON.parse(savedSettingsString)
                        : {};
                    setAPISettings({
                        ...defaultState,
                        ...savedSettings,
                    });
                } catch (e) {
                    setAPISettings({
                        ...defaultState,
                    });
                }
            } else {
                // Save state
                const settingsString = JSON.stringify(apiSettings);
                try {
                    await SecureStore.setItemAsync(
                        'apisettings',
                        settingsString,
                    );
                } catch (e) {
                    console.error('failed to save token');
                }
            }
        };

        run();
    }, [apiSettings, ready]);

    // when we have a token, try to log in and verify it
    React.useEffect(() => {
        if (apiSettings.token && !apiSettings.isLoggedIn) {
            // verify token here

            // if correct, get data
            Promise.all([fetchAbsences(), fetchSettings()])
                .then(() => {
                    setAPISettings((oldState) => {
                        return {
                            ...oldState,
                            isLoggedIn: true,
                        };
                    });
                    setReady(true);
                })
                .catch((e) => {
                    console.error('error fetching data on startup', e);
                });
        } else {
            // if there's no token, we're ready right away
            setReady(true);
        }
    }, [apiSettings, login, fetchAbsences, fetchSettings]);

    const settingsProp: APIContextType = React.useMemo(
        () => ({
            ready,
            isLoggedIn: apiSettings.isLoggedIn,
            fetchAbsences,
            fetchSettings,
            logout,
            login,
            searchTeachers,
            getClassesToday,
            isRealTeacher,
            saveSettings,
            saveSchedule,
            saveUserSettings,
        }),
        [
            ready,
            apiSettings.isLoggedIn,
            fetchAbsences,
            fetchSettings,
            logout,
            login,
            searchTeachers,
            getClassesToday,
            isRealTeacher,
            saveSettings,
            saveSchedule,
            saveUserSettings,
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
