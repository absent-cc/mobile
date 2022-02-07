import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AbsenceList } from '../api/APITypes';

export interface AppStateType {
    absences: AbsenceList;
}

export interface AppStateContextType {
    ready: boolean;
    value: AppStateType;
    resetAppState: () => void;
    setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
}

// Default settings
export const defaultState: AppStateType = {
    absences: [],
};

const AppStateContext = React.createContext<AppStateContextType>({
    ready: false,
    value: defaultState,
    resetAppState: () => {
        // default empty function
    },
    setAppState: () => {
        // default empty function
    },
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
    const [appState, setAppState] = React.useState<AppStateType>(defaultState);
    const [ready, setReady] = React.useState(false);

    // Save and read state
    React.useEffect(() => {
        const run = async () => {
            if (!ready) {
                // Read state
                const savedString = await AsyncStorage.getItem('appstate');

                if (savedString) {
                    let savedState;

                    try {
                        savedState = JSON.parse(savedString);
                    } catch (e) {
                        savedState = {};
                    }

                    setAppState({
                        ...defaultState,
                        ...savedState,
                    });
                } else {
                    setAppState({
                        ...defaultState,
                    });
                }
                setReady(true);
            } else {
                // Save state
                const stateString = JSON.stringify(appState);
                await AsyncStorage.setItem('appstate', stateString);
            }
        };

        run();
    }, [appState, ready]);

    // Memoized just in case
    const resetAppState = React.useCallback(() => {
        setAppState({
            ...defaultState,
        });
    }, [setAppState]);

    const appStateProp: AppStateContextType = React.useMemo(
        () => ({
            value: appState,
            ready,
            resetAppState,
            setAppState,
        }),
        [ready, appState, resetAppState],
    );

    return (
        <AppStateContext.Provider value={appStateProp}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    return React.useContext(AppStateContext);
}
