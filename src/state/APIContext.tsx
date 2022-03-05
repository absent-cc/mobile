import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSettings } from './SettingsContext';
import { useAppState } from './AppStateContext';
import * as APIMethods from '../api/APIMethods';
import {
    AbsenceList,
    Block,
    EditingSchedule,
    Schedule,
    UserSettings,
} from '../api/APITypes';
import { formatISODate } from '../DateWordUtils';
import {
    APIError,
    AuthenticationError,
    BadTokenError,
    NetworkError,
    NonNPSError,
    ServerError,
    UnknownError,
    ValidationError,
} from '../api/APIErrors';
import { useDialog } from '../components/dialog/Dialog';
import ErrorDialog from '../components/dialog/ErrorDialog';

export interface APIDataType {
    ready: boolean;
    isLoggedIn: boolean;
    lastTokenUpdate: number;
    token: string | null;
    refresh: string | null;
}

export interface APIContextType {
    ready: boolean;
    isLoggedIn: boolean;
    fetchAbsences: () => Promise<AbsenceList | null>;
    fetchSettings: () => Promise<{
        user: UserSettings;
        schedule: Schedule;
    } | null>;
    logout: () => Promise<void>;
    login: (accessToken: string) => Promise<void>;
    searchTeachers: (searchString: string) => Promise<string[] | null>;
    getClassesToday: () => Promise<Block[] | null>;
    isRealTeacher: (partialName: string) => Promise<{
        isReal: boolean;
        similar: string[];
    } | null>;
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
    fetchAbsences: async () => null,
    fetchSettings: async () => null,
    logout: async () => undefined,
    login: async () => undefined,
    searchTeachers: async () => null,
    getClassesToday: async () => null,
    isRealTeacher: async () => null,
    saveSettings: async () => undefined,
    saveSchedule: async () => undefined,
    saveUserSettings: async () => undefined,
});

const defaultState: APIDataType = {
    ready: false,
    isLoggedIn: false,
    lastTokenUpdate: 0,
    token: null,
    refresh: null,
};

export function APIProvider({ children }: { children: React.ReactNode }) {
    const [apiSettings, setAPISettings] =
        React.useState<APIDataType>(defaultState);
    const [serverLoaded, setServerLoaded] = React.useState(false);

    const { value: settings, setSettings, resetSettings } = useSettings();
    const { value: appState, setAppState } = useAppState();

    const logout = React.useCallback(async () => {
        // if (apiSettings.token !== null) {
        //     await APIMethods.logout(apiSettings.token);
        // }

        resetSettings();
        setAPISettings((oldState) => {
            return {
                ...oldState,
                token: null,
                isLoggedIn: false,
            };
        });
        setServerLoaded(false);
    }, [resetSettings]);

    const { open: openDialog, close: closeDialog } = useDialog();

    const parseError = React.useCallback(
        (error: any, hasRetried: boolean, caller: string): boolean => {
            if (error instanceof Error && error instanceof APIError) {
                if (error instanceof BadTokenError) {
                    // retry once
                    if (hasRetried) {
                        openDialog(
                            <ErrorDialog
                                message={error.message}
                                description={error.description || ''}
                                caller={error.caller}
                                close={closeDialog}
                            />,
                        );
                        logout();
                        return false;
                    }
                    return true;
                }
                if (error instanceof ValidationError) {
                    openDialog(
                        <ErrorDialog
                            message={error.message}
                            description={error.description || ''}
                            caller={error.caller}
                            close={closeDialog}
                        />,
                    );
                    return false;
                }
                if (error instanceof AuthenticationError) {
                    openDialog(
                        <ErrorDialog
                            message={error.message}
                            description={error.description || ''}
                            caller={error.caller}
                            close={closeDialog}
                        />,
                    );
                    logout();
                    return false;
                }
                if (error instanceof NonNPSError) {
                    openDialog(
                        <ErrorDialog
                            message={error.message}
                            description={error.description || ''}
                            caller={error.caller}
                            close={closeDialog}
                            lightVersion
                        />,
                    );
                    return false;
                }
                if (error instanceof ServerError) {
                    openDialog(
                        <ErrorDialog
                            message={error.message}
                            description={error.description || ''}
                            caller={error.caller}
                            close={closeDialog}
                        />,
                    );
                    return false;
                }
                if (error instanceof NetworkError) {
                    // retry once
                    if (hasRetried) {
                        openDialog(
                            <ErrorDialog
                                message={error.message}
                                description={error.description || ''}
                                caller={error.caller}
                                close={closeDialog}
                            />,
                        );
                        return false;
                    }
                    return true;
                }

                // unknown error
                openDialog(
                    <ErrorDialog
                        message={error.message}
                        description={error.description || ''}
                        caller={error.caller}
                        close={closeDialog}
                    />,
                );
                return false;
            }

            openDialog(
                <ErrorDialog
                    message="An unknown error occurred while connecting to the server."
                    description={error.message}
                    caller={caller}
                    close={closeDialog}
                />,
            );
            return false;
        },
        [logout, closeDialog, openDialog],
    );

    const verifyToken = React.useCallback(
        async (forceRefresh = false): Promise<string | null> => {
            if (apiSettings.token === null || apiSettings.refresh === null) {
                return null;
            }

            const now = Date.now();
            // check if token is valid, 10 mins
            if (!forceRefresh && now - apiSettings.lastTokenUpdate < 600000) {
                return apiSettings.token;
            }

            // send refresh token
            try {
                const { token, onboarded } = await APIMethods.refresh(
                    apiSettings.refresh,
                );

                // update settings
                setAPISettings((oldState) => ({
                    ...oldState,
                    lastTokenUpdate: now,
                    token,
                }));
                setSettings((oldSettings) => ({
                    ...oldSettings,
                    userOnboarded: onboarded,
                }));

                return token;
            } catch (err: any) {
                // never retry verifyToken
                parseError(err, true, 'Verify Token');
                return null;
            }
        },
        [
            apiSettings.lastTokenUpdate,
            setSettings,
            apiSettings.refresh,
            apiSettings.token,
            parseError,
        ],
    );

    const fetchAbsences = React.useCallback(
        async (hasRetried = false): Promise<AbsenceList | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                const response = await APIMethods.fetchAbsences(token);

                return response;
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Fetch Absences',
                );
                if (shouldRetry) {
                    return fetchAbsences(true);
                }
                return null;
            }
        },
        [parseError, verifyToken],
    );

    const fetchSettings = React.useCallback(
        async (
            hasRetried = false,
        ): Promise<{
            uid: string;
            user: UserSettings;
            schedule: Schedule;
        } | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                const response = await APIMethods.fetchSettings(token);

                return {
                    uid: response.uid,
                    user: response.user,
                    schedule: response.schedule,
                };
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Fetch Settings',
                );
                if (shouldRetry) {
                    return fetchSettings(true);
                }
                return null;
            }
        },
        [parseError, verifyToken],
    );

    const saveSettings = React.useCallback(
        async (
            newSettings: {
                user: UserSettings;
                schedule: EditingSchedule;
            },
            hasRetried = false,
        ) => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                const response = await APIMethods.saveSettings(
                    newSettings,
                    token,
                );

                setSettings((oldSettings) => {
                    return {
                        ...oldSettings,
                        user: response.user,
                        schedule: response.schedule,
                    };
                });
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Save Settings',
                );
                if (shouldRetry) {
                    saveSettings(newSettings, true);
                }
            }
        },
        [parseError, setSettings, verifyToken],
    );

    const saveSchedule = React.useCallback(
        async (newSettings: EditingSchedule, hasRetried = false) => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                const response = await APIMethods.saveSchedule(
                    newSettings,
                    token,
                );

                setSettings((oldSettings) => {
                    return {
                        ...oldSettings,
                        schedule: response,
                    };
                });
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Save Schedule',
                );
                if (shouldRetry) {
                    saveSchedule(newSettings, true);
                }
            }
        },
        [parseError, setSettings, verifyToken],
    );

    const saveUserSettings = React.useCallback(
        async (newSettings: UserSettings, hasRetried = false) => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                await APIMethods.saveUserSettings(newSettings, token);

                // even though the api doesn't return it, we still need to set the new settings
                setSettings((oldSettings) => {
                    return {
                        ...oldSettings,
                        user: newSettings,
                    };
                });
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Save User Settings',
                );
                if (shouldRetry) {
                    saveUserSettings(newSettings, true);
                }
            }
        },
        [parseError, verifyToken, setSettings],
    );

    const searchTeachers = React.useCallback(
        async (
            searchString: string,
            hasRetried = false,
        ): Promise<string[] | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                return APIMethods.searchTeachers(
                    searchString,
                    settings.user.school,
                    token,
                );
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Search Teachers',
                );
                if (shouldRetry) {
                    return searchTeachers(searchString, true);
                }
                return null;
            }
        },
        [verifyToken, settings.user.school, parseError],
    );

    const isRealTeacher = React.useCallback(
        async (
            partialName: string,
            hasRetried = false,
        ): Promise<{
            isReal: boolean;
            similar: string[];
        } | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                return APIMethods.isRealTeacher(
                    partialName,
                    settings.user.school,
                    token,
                );
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Is Real Teacher Check',
                );
                if (shouldRetry) {
                    return isRealTeacher(partialName, true);
                }
                return null;
            }
        },
        [verifyToken, settings.user.school, parseError],
    );

    // since the get classes endpoint takes a date, we'll just regenerate this function once per day
    const dateStr = formatISODate(new Date(appState.lastUpdateTime));
    const getClassesToday = React.useCallback(
        async (hasRetried = false): Promise<Block[] | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                return APIMethods.getClassesToday(dateStr, token);
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Get Classes Today',
                );
                if (shouldRetry) {
                    return getClassesToday(true);
                }
                return null;
            }
        },
        [verifyToken, dateStr, parseError],
    );

    const login = React.useCallback(
        async (accessToken: string) => {
            try {
                const { token, refresh, onboarded } = await APIMethods.login(
                    accessToken,
                );
                const now = Date.now();

                setSettings((oldState) => ({
                    ...oldState,
                    userOnboarded: onboarded,
                }));
                setAPISettings((oldState) => ({
                    ...oldState,
                    lastTokenUpdate: now,
                    refresh,
                    token,
                    isLoggedIn: true,
                }));
            } catch (err: any) {
                // don't retry login
                parseError(err, true, 'Login');
            }
        },
        [parseError, setSettings],
    );

    // read token only once
    React.useEffect(() => {
        SecureStore.getItemAsync('apisettings')
            .then((savedSettingsString) => {
                return savedSettingsString
                    ? JSON.parse(savedSettingsString)
                    : {};
            })
            .then((savedSettings) => {
                setAPISettings({
                    ...defaultState,
                    ...savedSettings,
                    ready: true,
                });
            })
            .catch(() => {
                setAPISettings({
                    ...defaultState,
                    ready: true,
                });
            });
    }, []);

    // save token on change
    React.useEffect(() => {
        if (apiSettings.ready) {
            const settingsString = JSON.stringify(apiSettings);
            SecureStore.setItemAsync('apisettings', settingsString).catch(
                (e) => {
                    parseError(
                        new UnknownError('Saving token', e.message),
                        true,
                        'Saving token',
                    );
                },
            );
        }
    }, [apiSettings, parseError]);

    // when we have a token, try to log in and verify it
    // this runs when the app starts or a user just logged in
    React.useEffect(() => {
        if (apiSettings.isLoggedIn && !serverLoaded) {
            verifyToken().then((isValid) => {
                if (!isValid) {
                    logout();
                } else {
                    // this is a good token, so make sure that we fetch new data first
                    Promise.all([
                        fetchAbsences(),
                        fetchSettings(),
                        getClassesToday(),
                    ])
                        .then(([absences, newSettings, classesToday]) => {
                            setAppState((oldAppState) => {
                                const stateChanges = {
                                    ...oldAppState,
                                    // needsUpdate: false,
                                    serverLoaded: true,
                                };
                                if (absences !== null)
                                    stateChanges.absences = absences;
                                if (classesToday !== null)
                                    stateChanges.blocksToday = classesToday;
                                return stateChanges;
                            });
                            setSettings((oldSettings) => {
                                const stateChanges = {
                                    ...oldSettings,
                                    serverLoaded: true,
                                };
                                if (newSettings !== null) {
                                    stateChanges.user = newSettings.user;
                                    stateChanges.schedule =
                                        newSettings.schedule;
                                }
                                return stateChanges;
                            });
                            setServerLoaded(true);
                        })
                        .catch((e: any) => {
                            // don't retry this, it shouldn't error
                            parseError(e, true, 'Startup load');
                        });
                }
            });
        }
    }, [
        logout,
        apiSettings.isLoggedIn,
        serverLoaded,
        verifyToken,
        fetchAbsences,
        fetchSettings,
        getClassesToday,
        setAppState,
        setSettings,
        parseError,
    ]);

    // auto app state updating
    // React.useEffect(() => {
    //     if (
    //         apiSettings.ready &&
    //         apiSettings.token &&
    //         apiSettings.isLoggedIn &&
    //         appState.needsUpdate
    //     ) {
    //         Promise.all([fetchAbsences(), fetchSettings(), getClassesToday()])
    //             .then(([absences, newSettings, classesToday]) => {
    //                 setAppState((oldAppState) => {
    //                     const stateChanges = {
    //                         ...oldAppState,
    //                         needsUpdate: false,
    //                     };
    //                     if (absences !== null) stateChanges.absences = absences;
    //                     if (classesToday !== null)
    //                         stateChanges.blocksToday = classesToday;
    //                     return stateChanges;
    //                 });
    //                 setSettings((oldSettings) => {
    //                     const stateChanges = {
    //                         ...oldSettings,
    //                     };
    //                     if (newSettings !== null) {
    //                         stateChanges.uid = newSettings.uid;
    //                         stateChanges.user = newSettings.user;
    //                         stateChanges.schedule = newSettings.schedule;
    //                     }
    //                     return stateChanges;
    //                 });
    //             })
    //             .catch((e) => {
    //                 console.error('error fetching data on auto update', e);
    //             });
    //     }
    // }, [
    //     appState,
    //     apiSettings.ready,
    //     apiSettings.isLoggedIn,
    //     apiSettings.token,
    //     setAppState,
    //     fetchAbsences,
    //     getClassesToday,
    //     fetchSettings,
    //     setSettings,
    // ]);

    const settingsProp: APIContextType = React.useMemo(
        () => ({
            ready: apiSettings.ready,
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
            apiSettings.ready,
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
