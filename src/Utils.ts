import { Block, Schedule } from './api/APITypes';

export const BlockMapping: Record<Block, string> = {
    A: 'A Block',
    B: 'B Block',
    C: 'C Block',
    D: 'D Block',
    E: 'E Block',
    F: 'F Block',
    G: 'G Block',
    ADV: 'Advisory',
    EXTRA: 'Extra Teachers',
};

export const EmptySchedule: Schedule = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    ADV: [],
    EXTRA: [],
};
