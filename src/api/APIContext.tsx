import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { AppSettings, useSettings } from '../state/SettingsContext';
import { useAppState } from '../state/AppStateContext';
import * as APIMethods from './APIMethods';
import {
    AbsenceList,
    Block,
    EditingSchedule,
    Schedule,
    UserSettings,
    WeekSchedule,
} from './APITypes';
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
} from './APIErrors';
import { useDialog } from '../components/dialog/Dialog';
import ErrorDialog from '../components/dialog/ErrorDialog';

export interface APIDataType {
    ready: boolean;
    isVerified: boolean;
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
        app: AppSettings;
    } | null>;
    logout: () => Promise<void>;
    login: (accessToken: string) => Promise<void>;
    searchTeachers: (searchString: string) => Promise<string[] | null>;
    fetchWeekSchedule: () => Promise<WeekSchedule | null>;
    isRealTeacher: (partialName: string) => Promise<{
        isReal: boolean;
        similar: string[];
    } | null>;
    saveSettings: (newSettings: {
        user: UserSettings;
        schedule: EditingSchedule;
        app: AppSettings;
    }) => Promise<boolean>;
    saveSchedule: (newSettings: EditingSchedule) => Promise<void>;
    saveUserSettings: (newSettings: UserSettings) => Promise<void>;
    saveAppSettings: (newSettings: AppSettings) => Promise<void>;
    saveFCMToken: (fcmToken: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    refreshData: () => Promise<void>;
}

const APIContext = React.createContext<APIContextType>({
    ready: false,
    isLoggedIn: false,
    fetchAbsences: async () => null,
    fetchSettings: async () => null,
    logout: async () => undefined,
    login: async () => undefined,
    searchTeachers: async () => null,
    fetchWeekSchedule: async () => null,
    isRealTeacher: async () => null,
    saveSettings: async () => false,
    saveSchedule: async () => undefined,
    saveUserSettings: async () => undefined,
    saveAppSettings: async () => undefined,
    saveFCMToken: async () => undefined,
    deleteAccount: async () => undefined,
    refreshData: async () => undefined,
});

const defaultState: APIDataType = {
    ready: false,
    isVerified: false,
    isLoggedIn: false,
    lastTokenUpdate: 0,
    token: null,
    refresh: null,
};

export function APIProvider({ children }: { children: React.ReactNode }) {
    const [apiSettings, setAPISettings] =
        React.useState<APIDataType>(defaultState);
    const [apiServerLoaded, setAPIServerLoaded] = React.useState(false);

    const { value: settings, setSettings, resetSettings } = useSettings();
    const { value: appState, setAppState, resetAppState } = useAppState();
    const { open: openDialog, close: closeDialog } = useDialog();

    const dateStr = appState.dateToday;
    const schoolName = settings.user.school;

    // TODO: figure out how this is different from apiSettings.isVerified
    //       why do i write code like this :(
    // this (maybe) stores if the token has been verified after initial login
    const isLoggedInRef = React.useRef(false);

    // this one logs the user out without sending the request to the server
    // TODO: make sure the fcm token actually gets deleted
    const simpleLogout = React.useCallback(async () => {
        isLoggedInRef.current = false;
        resetAppState();
        resetSettings();
        setAPISettings({
            ...defaultState,
            ready: true,
        });
        setAPIServerLoaded(false);
    }, [resetAppState, resetSettings]);

    const parseError = React.useCallback(
        (error: any, hasRetried: boolean, caller: string): boolean => {
            const lightVersion = ['Login'].includes(caller);
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
                                lightVersion={lightVersion}
                            />,
                        );
                        simpleLogout();
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
                            lightVersion={lightVersion}
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
                            lightVersion={lightVersion}
                        />,
                    );
                    simpleLogout();
                    return false;
                }
                if (error instanceof NonNPSError) {
                    openDialog(
                        <ErrorDialog
                            message={error.message}
                            description={error.description || ''}
                            caller={error.caller}
                            close={closeDialog}
                            lightVersion={lightVersion}
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
                            lightVersion={lightVersion}
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
                                lightVersion={lightVersion}
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
                        lightVersion={lightVersion}
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
                    lightVersion={lightVersion}
                />,
            );
            return false;
        },
        [simpleLogout, closeDialog, openDialog],
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
                    isVerified: true,
                    lastTokenUpdate: now,
                    token,
                }));
                // fetchSettings doesn't tell us if the user is onboarded, so we need to get that from this refresh call
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

    const logout = React.useCallback(
        async (hasRetried = false) => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                await APIMethods.logout(token);

                await simpleLogout();
            } catch (err: any) {
                const shouldRetry = parseError(err, hasRetried, 'Logout');
                if (shouldRetry) {
                    logout(true);
                }
            }
        },
        [parseError, simpleLogout, verifyToken],
    );

    const fetchAbsences = React.useCallback(
        async (hasRetried = false): Promise<AbsenceList | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                const response = await APIMethods.fetchAbsences(
                    token,
                    dateStr,
                    schoolName,
                );

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
        [dateStr, schoolName, parseError, verifyToken],
    );

    const fetchSettings = React.useCallback(
        async (
            hasRetried = false,
        ): Promise<{
            uid: string;
            user: UserSettings;
            schedule: Schedule;
            app: AppSettings;
        } | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                const response = await APIMethods.fetchSettings(token);

                return {
                    uid: response.uid,
                    user: response.user,
                    schedule: response.schedule,
                    app: response.app,
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
                app: AppSettings;
            },
            hasRetried = false,
        ): Promise<boolean> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return false;

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
                        app: response.app,
                    };
                });

                return true;
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Save Settings',
                );
                if (shouldRetry) {
                    return saveSettings(newSettings, true);
                }
            }
            return false;
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

    const saveAppSettings = React.useCallback(
        async (newSettings: AppSettings, hasRetried = false) => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                await APIMethods.saveAppSettings(newSettings, token);

                // even though the api doesn't return it, we still need to set the new settings
                setSettings((oldSettings) => {
                    return {
                        ...oldSettings,
                        app: newSettings,
                    };
                });
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Save App Settings',
                );
                if (shouldRetry) {
                    saveAppSettings(newSettings, true);
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
                return await APIMethods.searchTeachers(
                    searchString,
                    schoolName,
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
        [verifyToken, schoolName, parseError],
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
                return await APIMethods.isRealTeacher(
                    partialName,
                    schoolName,
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
        [verifyToken, schoolName, parseError],
    );

    const fetchWeekSchedule = React.useCallback(
        async (hasRetried = false): Promise<WeekSchedule | null> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return null;

            try {
                return await APIMethods.fetchWeekSchedule(
                    dateStr,
                    schoolName,
                    token,
                );
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Fetch Week Schedule',
                );
                if (shouldRetry) {
                    return fetchWeekSchedule(true);
                }
                return null;
            }
        },
        [verifyToken, dateStr, schoolName, parseError],
    );

    // (step 2 **) only if the user hasn't logged in before
    //             this runs once a user signs in through google
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

    const saveFCMToken = React.useCallback(
        async (fcmToken: string, hasRetried = false): Promise<void> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                await APIMethods.saveFCMToken(fcmToken, token);
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Save FCM Token',
                );
                if (shouldRetry) {
                    saveFCMToken(fcmToken, true);
                }
            }
        },
        [verifyToken, parseError],
    );

    const deleteAccount = React.useCallback(
        async (hasRetried = false): Promise<void> => {
            const token = await verifyToken(hasRetried);
            if (token === null) return;

            try {
                await APIMethods.deleteAccount(token);
            } catch (err: any) {
                const shouldRetry = parseError(
                    err,
                    hasRetried,
                    'Delete Account',
                );
                if (shouldRetry) {
                    deleteAccount(true);
                }
            }
        },
        [verifyToken, parseError],
    );

    const refreshData = React.useCallback(async (): Promise<void> => {
        try {
            await Promise.all([
                fetchSettings(),
                fetchAbsences(),
                fetchWeekSchedule(),
            ]).then(([newSettings, absences, weekSchedule]) => {
                setAppState((oldAppState) => {
                    const stateChanges = {
                        ...oldAppState,
                        needsUpdate: false,
                    };
                    if (absences !== null) stateChanges.absences = absences;
                    if (weekSchedule !== null)
                        stateChanges.weekSchedule = weekSchedule;
                    return stateChanges;
                });
                setSettings((oldSettings) => {
                    const stateChanges = {
                        ...oldSettings,
                    };
                    if (newSettings !== null) {
                        stateChanges.user = newSettings.user;
                        stateChanges.schedule = newSettings.schedule;
                        stateChanges.app = newSettings.app;
                    }
                    return stateChanges;
                });
            });
        } catch (err: any) {
            parseError(err, true, 'Refresh Data');
        }
    }, [
        fetchAbsences,
        fetchSettings,
        fetchWeekSchedule,
        parseError,
        setAppState,
        setSettings,
    ]);

    // (step 1) read token from storage
    //          if it exists, we mark as ready but unverified
    // read token only once
    React.useEffect(() => {
        SecureStore.getItemAsync('apisettings')
            .then((savedSettingsString) => {
                return savedSettingsString
                    ? JSON.parse(savedSettingsString)
                    : {};
            })
            .then((savedSettings) => {
                // if the user has logged in before, isLoggedIn will be true
                setAPISettings({
                    ...defaultState,
                    ...savedSettings,
                    isVerified: false,
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

    // (step 3) verify the token once we have it
    // when we have a token, try to log in and verify it
    // this runs when the app starts or a user just logged in
    React.useEffect(() => {
        if (
            apiSettings.isLoggedIn &&
            !apiSettings.isVerified &&
            !apiServerLoaded
        ) {
            verifyToken(true).then((token) => {
                if (!token) {
                    logout();
                }
                isLoggedInRef.current = true;
                setAPIServerLoaded(true);
            });
        }
    }, [
        apiSettings.isLoggedIn,
        apiSettings.isVerified,
        apiServerLoaded,
        verifyToken,
        logout,
    ]);

    // (step 4) get the user's settings
    //          if the user is not onboarded, this will cause the onboarding screens to show
    //          if the user is     onboarded, this will load step 5 right away
    React.useEffect(() => {
        if (
            apiSettings.isLoggedIn &&
            isLoggedInRef.current &&
            apiServerLoaded &&
            !settings.serverLoaded &&
            apiSettings.isVerified
        ) {
            fetchSettings()
                .then((newSettings) => {
                    setSettings((oldSettings) => {
                        const stateChanges = {
                            ...oldSettings,
                            serverLoaded: true,
                        };
                        if (newSettings !== null) {
                            stateChanges.user = newSettings.user;
                            stateChanges.schedule = newSettings.schedule;
                            stateChanges.app = newSettings.app;
                        }
                        return stateChanges;
                    });
                })
                .catch((e: any) => {
                    // don't retry this, it shouldn't error
                    parseError(e, true, 'Startup load');
                });
        }
    }, [
        apiServerLoaded,
        apiSettings.isLoggedIn,
        apiSettings.isVerified,
        fetchSettings,
        parseError,
        setSettings,
        settings.serverLoaded,
    ]);

    // (step 5) get app state variables
    //          this runs separately from settings fetch since it requires the user's school
    //          ** loading process complete **

    // this will run:
    // after logged in, after getting credentials, after loading settings
    // once the user is onboarded, only once at the start of the app
    React.useEffect(() => {
        if (
            apiSettings.isLoggedIn &&
            isLoggedInRef.current &&
            apiServerLoaded &&
            settings.serverLoaded &&
            settings.userOnboarded &&
            !appState.serverLoaded &&
            apiSettings.isVerified
        ) {
            Promise.all([fetchAbsences(), fetchWeekSchedule()])
                .then(([absences, weekSchedule]) => {
                    setAppState((oldAppState) => {
                        const stateChanges = {
                            ...oldAppState,
                            // needsUpdate: false,
                            serverLoaded: true,
                        };
                        if (absences !== null) stateChanges.absences = absences;
                        if (weekSchedule !== null)
                            stateChanges.weekSchedule = weekSchedule;
                        return stateChanges;
                    });
                })
                .catch((e: any) => {
                    // don't retry this, it shouldn't error
                    parseError(e, true, 'Startup load');
                });
        }
    }, [
        apiServerLoaded,
        apiSettings.isLoggedIn,
        apiSettings.isVerified,
        appState.serverLoaded,
        fetchAbsences,
        fetchWeekSchedule,
        parseError,
        setAppState,
        settings.serverLoaded,
        settings.userOnboarded,
    ]);

    // auto state updating at midnight
    // basically this should only run once the user is like super logged in and onboarded
    React.useEffect(() => {
        if (
            apiSettings.isLoggedIn &&
            settings.userOnboarded &&
            settings.serverLoaded &&
            // runs only when requested by AppStateContext updater
            appState.needsUpdate
        ) {
            refreshData();
        }
    }, [
        apiSettings.isLoggedIn,
        settings.userOnboarded,
        appState.needsUpdate,
        settings.user.school,
        refreshData,
        settings.serverLoaded,
    ]);

    const settingsProp: APIContextType = React.useMemo(
        () => ({
            ready: apiSettings.ready,
            isLoggedIn: apiSettings.isLoggedIn,
            fetchAbsences,
            fetchSettings,
            logout,
            login,
            searchTeachers,
            isRealTeacher,
            saveSettings,
            saveSchedule,
            saveUserSettings,
            saveAppSettings,
            saveFCMToken,
            deleteAccount,
            refreshData,
            fetchWeekSchedule,
        }),
        [
            apiSettings.ready,
            apiSettings.isLoggedIn,
            fetchAbsences,
            fetchSettings,
            logout,
            login,
            searchTeachers,
            isRealTeacher,
            saveSettings,
            saveSchedule,
            saveUserSettings,
            saveAppSettings,
            saveFCMToken,
            deleteAccount,
            refreshData,
            fetchWeekSchedule,
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
