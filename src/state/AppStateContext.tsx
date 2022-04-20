import React from 'react';
import {
    AbsenceList,
    Block,
    TeacherBlock,
    WeekSchedule,
} from '../api/APITypes';
import { formatISODate, isSameDay } from '../DateWordUtils';
import { extractDayBlocks, extractTeacherBlocks } from '../Utils';

export interface AppStateType {
    serverLoaded: boolean;
    absences: AbsenceList;
    teacherBlocksToday: TeacherBlock[];
    dayBlocksToday: Block[];
    lastUpdateTime: Date;
    tallestWaveHeader: number;
    weekSchedule: WeekSchedule;
    dateToday: string;
    currentBlock: {
        block: Block | null;
        relation: 'current' | 'after';
    };
    needsUpdate: boolean;
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
    teacherBlocksToday: [],
    dayBlocksToday: [],
    lastUpdateTime: new Date(0),
    tallestWaveHeader: 250,
    dateToday: formatISODate(new Date()),
    weekSchedule: {},
    currentBlock: {
        block: null,
        relation: 'current',
    },
    needsUpdate: false,
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
        // debug mode
        const loopStartTime = Date.now();
        const virtualStartTime = new Date(2022, 3, 13, 23, 59, 45).getTime();

        const update = () => {
            setAppState((oldAppState) => {
                const lastStateUpdate = oldAppState.lastUpdateTime;
                // const now = new Date();
                const now = new Date(
                    Date.now() - loopStartTime + virtualStartTime,
                );
                console.log('running loop at', now.toString());

                const stateChanges: AppStateType = {
                    ...oldAppState,
                    lastUpdateTime: now,
                    dateToday: formatISODate(now),
                };

                // reset day
                if (!isSameDay(lastStateUpdate, now)) {
                    stateChanges.absences = [];

                    // if it's a new week
                    if (
                        !(stateChanges.dateToday in stateChanges.weekSchedule)
                    ) {
                        stateChanges.weekSchedule = {};
                    }

                    stateChanges.needsUpdate = true;
                }

                return stateChanges;
            });
        };

        // Initial update on load
        update();

        const interval = setInterval(update, 5 * 1000);

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        setAppState((oldAppState) => ({
            ...oldAppState,
            teacherBlocksToday: extractTeacherBlocks(
                oldAppState.weekSchedule[oldAppState.dateToday],
            ),
            dayBlocksToday: extractDayBlocks(
                oldAppState.weekSchedule[oldAppState.dateToday],
            ),
        }));
    }, [appState.weekSchedule]);

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
