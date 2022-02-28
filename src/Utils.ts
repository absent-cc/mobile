import {
    Block,
    EditingSchedule,
    Grade,
    Schedule,
    SchoolName,
    UserSettings,
} from './api/APITypes';
import { AppSettings } from './state/SettingsContext';

export const BlockIterator: Block[] = [
    Block.A,
    Block.B,
    Block.C,
    Block.D,
    Block.E,
    Block.F,
    Block.G,
    Block.ADVISORY,
    Block.EXTRA,
];

export const BlockMapping: Record<Block, string> = {
    A: 'A Block',
    B: 'B Block',
    C: 'C Block',
    D: 'D Block',
    E: 'E Block',
    F: 'F Block',
    G: 'G Block',
    ADVISORY: 'Advisory',
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
    ADVISORY: 'ADVISORY',
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
    ADVISORY: [],
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
    ADVISORY: [],
    EXTRA: [],
};

export const EmptyUser: UserSettings = {
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

export const numToGrade = (num: number): Grade => {
    switch (num) {
        case 9:
            return Grade.G9;
        case 10:
            return Grade.G10;
        case 11:
            return Grade.G11;
        case 12:
            return Grade.G12;
        default:
            return Grade.NONE;
    }
};

export const SchoolList = [SchoolName.NSHS, SchoolName.NNHS];

export const schoolIndexer = (school: SchoolName): number => {
    return SchoolList.indexOf(school);
};

export const strToSchool = (str: string): SchoolName => {
    switch (str) {
        case 'NSHS':
            return SchoolName.NSHS;
        case 'NNHS':
            return SchoolName.NNHS;
        default:
            return SchoolName.NONE;
    }
};

export const apiResponseToSchedule = (
    response: Record<Block, any[] | null>,
): Schedule => {
    const schedule: Partial<Schedule> = {};
    BlockIterator.forEach((block) => {
        const responseObj = response[block];
        if (responseObj !== null) {
            schedule[block] = responseObj.map((teacher: any) => ({
                tid: teacher.tid,
                name: joinName(teacher.first, teacher.last),
                school: strToSchool(teacher.school),
            }));
        } else {
            schedule[block] = [];
        }
    });

    return schedule as Schedule;
};
