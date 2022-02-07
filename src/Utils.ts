import {
    Block,
    EditingSchedule,
    Grade,
    Schedule,
    SchoolName,
    UserSettings,
} from './api/APITypes';
import { AppSettings } from './state/SettingsContext';

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

export const ShortBlocks: Record<Block, string> = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    ADV: 'ADV',
    EXTRA: 'EXTRA',
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

export const EmptyEditingSchedule: EditingSchedule = {
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

export const EmptyUser: UserSettings = {
    uid: '',
    name: '',
    school: SchoolName.NONE,
    grade: Grade.NONE,
};

export const splitName = (full: string): string[] => {
    const spaceIndex = full.indexOf(' ');

    if (spaceIndex === -1) {
        return [full, ''];
    }

    return [full.substring(0, spaceIndex), full.substring(spaceIndex + 1)];
};

export const joinName = (first: string, last: string): string => {
    return [first, last].filter((name) => name.length > 0).join(' ');
};

export const DefaultAppSettings: AppSettings = {
    showFreeBlocks: true,
    sendNotifications: true,
    sendNoAbsenceNotification: true,
};

export const GradeList = [Grade.G9, Grade.G10, Grade.G11, Grade.G12];

export const gradeIndexer = (grade: Grade): number => {
    return GradeList.indexOf(grade);
};

export const SchoolList = [SchoolName.NSHS, SchoolName.NNHS];

export const schoolIndexer = (school: SchoolName): number => {
    return SchoolList.indexOf(school);
};
