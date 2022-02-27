import React from 'react';
import { AbsenceList, Block } from '../api/APITypes';
import { isSameDay } from '../DateWordUtils';

export interface AppStateType {
    serverLoaded: boolean;
    absences: AbsenceList;
    blocksToday: Block[];
    lastUpdateTime: number;
    // needsUpdate: boolean;
}

export interface AppStateContextType {
    value: AppStateType;
    resetAppState: () => void;
    setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
}

// Default settings
export const defaultState: AppStateType = {
    serverLoaded: false,
    absences: [],
    blocksToday: [],
    lastUpdateTime: 0,
    // needsUpdate: false,
};

const AppStateContext = React.createContext<AppStateContextType>({
    value: defaultState,
    resetAppState: () => undefined,
    setAppState: () => undefined,
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
    const [appState, setAppState] = React.useState<AppStateType>(defaultState);

    // state updater
    React.useEffect(() => {
        const update = () => {
            setAppState((oldAppState) => {
                const lastStateUpdate = oldAppState.lastUpdateTime;
                const now = Date.now();

                const stateChanges: AppStateType = {
                    ...oldAppState,
                    lastUpdateTime: now,
                    // needsUpdate: true,
                };

                // reset day
                if (!isSameDay(new Date(lastStateUpdate), new Date(now))) {
                    stateChanges.absences = [];
                    stateChanges.blocksToday = [];
                }

                return stateChanges;
            });
        };

        // Initial update on load
        update();

        const interval = setInterval(update, 5 * 1000);

        return () => clearInterval(interval);
    }, []);

    // Memoized just in case
    const resetAppState = React.useCallback(() => {
        setAppState({
            ...defaultState,
        });
    }, [setAppState]);

    const appStateProp: AppStateContextType = React.useMemo(
        () => ({
            value: appState,
            resetAppState,
            setAppState,
        }),
        [appState, resetAppState],
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
