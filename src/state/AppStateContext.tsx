import React from 'react';
import {
    AbsenceList,
    Block,
    LunchType,
    TeacherBlock,
    WeekSchedule,
} from '../api/APITypes';
import { formatISODate, isSameDay } from '../DateWordUtils';
import { extractDayBlocks, extractTeacherBlocks } from '../Utils';

export enum TimeRelation {
    Current,
    After,
}
export interface AppStateType {
    demo: boolean;
    serverLoaded: boolean;
    absences: AbsenceList;
    teacherBlocksToday: TeacherBlock[];
    dayBlocksToday: Block[];
    lastUpdateTime: Date;
    tallestWaveHeader: number;
    weekSchedule: WeekSchedule;
    dateToday: string;
    current: {
        block: Block | null;
        blockRelation: TimeRelation;
        lunch: LunchType | null;
        lunchRelation: TimeRelation;
    };
    needsUpdate: boolean;
    fullWeekMinuteRatio: number;
    fullWeekTooSmall: Record<string, number>;
}

export interface AppStateContextType {
    value: AppStateType;
    resetAppState: () => void;
    setAppState: React.Dispatch<React.SetStateAction<AppStateType>>;
}

// const virtualStartTime = new Date(2022, 9, 27, 12, 40, 45).getTime();

// Default settings
export const defaultState: AppStateType = {
    demo: false,
    serverLoaded: false,
    absences: [],
    teacherBlocksToday: [],
    dayBlocksToday: [],
    lastUpdateTime: new Date(),
    // lastUpdateTime: new Date(virtualStartTime),
    tallestWaveHeader: 150,
    dateToday: formatISODate(new Date()),
    // dateToday: formatISODate(new Date(virtualStartTime)),
    weekSchedule: {},
    current: {
        block: null,
        blockRelation: TimeRelation.Current,
        lunch: null,
        lunchRelation: TimeRelation.Current,
    },
    needsUpdate: false,
    fullWeekMinuteRatio: 0,
    fullWeekTooSmall: {},
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
        // only start once the state gets loaded
        if (!appState.serverLoaded) return () => undefined;

        // debug mode
        // const loopStartTime = Date.now();

        const update = () => {
            setAppState((oldAppState) => {
                const lastStateUpdate = oldAppState.lastUpdateTime;
                const now = new Date();
                // const now = new Date(
                //     Date.now() - loopStartTime + virtualStartTime,
                // );
                const nowMinRep = now.getHours() * 60 + now.getMinutes();
                const dateToday = formatISODate(now);

                const stateChanges: AppStateType = {
                    ...oldAppState,
                    lastUpdateTime: now,
                    dateToday,
                };

                // reset day
                if (
                    lastStateUpdate.getTime() > 0 &&
                    !isSameDay(lastStateUpdate, now)
                ) {
                    stateChanges.absences = [];

                    // if it's a new week
                    if (
                        !(stateChanges.dateToday in stateChanges.weekSchedule)
                    ) {
                        stateChanges.weekSchedule = {};
                    }

                    stateChanges.needsUpdate = true;
                }

                // process the blocks
                stateChanges.teacherBlocksToday = extractTeacherBlocks(
                    oldAppState.weekSchedule[dateToday],
                );
                stateChanges.dayBlocksToday = extractDayBlocks(
                    oldAppState.weekSchedule[dateToday],
                );

                const todaySchedule =
                    stateChanges.weekSchedule[stateChanges.dateToday]?.schedule;
                if (todaySchedule && todaySchedule.length > 0) {
                    let lastBlockIndex = -1;
                    let blockRelation = TimeRelation.Current;

                    for (let i = 0; i < todaySchedule.length; i += 1) {
                        const dayBlock = todaySchedule[i];

                        // first block is after now (before start of school day)
                        if (i === 0 && dayBlock.startTime > nowMinRep) {
                            lastBlockIndex = -1;
                            blockRelation = TimeRelation.Current;
                            break;
                        }

                        // last block is before now (after end of school day)
                        if (
                            i === todaySchedule.length - 1 &&
                            dayBlock.endTime < nowMinRep
                        ) {
                            lastBlockIndex = -1;
                            blockRelation = TimeRelation.After;
                            break;
                        }

                        // keep moving up the lastBlockIndex until it's not applicable
                        if (nowMinRep >= dayBlock.startTime) {
                            lastBlockIndex = i;

                            // if we find it inside the block, then stop
                            if (nowMinRep < dayBlock.endTime) {
                                blockRelation = TimeRelation.Current;
                                break;
                            } else {
                                blockRelation = TimeRelation.After;
                            }
                        }
                    }

                    // now once we've found the block, let's find the lunch
                    let lastLunchIndex = -1;
                    let lunchRelation = TimeRelation.Current;

                    const currentBlock = todaySchedule[lastBlockIndex] ?? null;
                    if (currentBlock !== null) {
                        if (
                            currentBlock.lunches &&
                            currentBlock.lunches.length > 0
                        ) {
                            for (
                                let i = 0;
                                i < currentBlock.lunches.length;
                                i += 1
                            ) {
                                const lunchBlock = currentBlock.lunches[i];

                                // keep moving up the lastLunchIndex until it's not applicable
                                if (nowMinRep >= lunchBlock.startTime) {
                                    lastLunchIndex = i;

                                    // if we find it inside the block, then stop
                                    if (nowMinRep < lunchBlock.endTime) {
                                        lunchRelation = TimeRelation.Current;
                                        break;
                                    } else {
                                        lunchRelation = TimeRelation.After;
                                    }
                                }
                            }
                        }
                    }

                    stateChanges.current = {
                        block:
                            currentBlock !== null ? currentBlock.block : null,
                        blockRelation,
                        lunch:
                            // get current lunch id but make it null if lastLunchIndex is wrong for some reason
                            lastLunchIndex > -1
                                ? currentBlock.lunches?.[lastLunchIndex]
                                      ?.lunch ?? null
                                : null,
                        lunchRelation,
                    };
                }

                return stateChanges;
            });
        };

        // Initial update on load
        update();

        const interval = setInterval(update, 5 * 1000);

        return () => clearInterval(interval);
    }, [appState.serverLoaded]);

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
