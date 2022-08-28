import {
    Block,
    DaySchedule,
    EditingSchedule,
    Grade,
    LunchType,
    Schedule,
    SchoolName,
    TeacherBlock,
    UserSettings,
} from './api/APITypes';
import { AppSettings } from './state/SettingsContext';

export const BlockIterator: TeacherBlock[] = [
    TeacherBlock.A,
    TeacherBlock.B,
    TeacherBlock.C,
    TeacherBlock.D,
    TeacherBlock.E,
    TeacherBlock.F,
    TeacherBlock.G,
    TeacherBlock.ADVISORY,
    TeacherBlock.EXTRA,
];

// full block names used in headers for settings
export const TeacherBlockFullNames: Record<TeacherBlock, string> = {
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

// used in block cards
export const ShortBlocks: Record<Block, string> = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    ADVISORY: 'ADV',
    WIN: 'WIN',
    LION: 'LION',
    TIGER: 'TIGR',
};

// used in the "the blocks today are" on the home page
export const ShortBlockFullNames: Record<Block, string> = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    ADVISORY: 'Advisory',
    WIN: 'WIN',
    LION: 'Lion',
    TIGER: 'Tiger',
};

// day block full names
export const DayBlockFullNames: Record<Block, string> = {
    A: 'A Block',
    B: 'B Block',
    C: 'C Block',
    D: 'D Block',
    E: 'E Block',
    F: 'F Block',
    G: 'G Block',
    ADVISORY: 'Advisory',
    WIN: 'WIN',
    LION: 'Lion',
    TIGER: 'Tiger',
};

// lunch names
export const LunchNames: Record<LunchType, string> = {
    L1: '1st',
    L2: '2nd',
    L3: '3rd',
};

export const LunchNums: Record<LunchType, string> = {
    L1: '1',
    L2: '2',
    L3: '3',
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
    response: Record<TeacherBlock, any[] | null>,
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

export const joinListWithCommas = (list: any[]) => {
    let result = '';
    for (let i = 0; i < list.length; i += 1) {
        let joiner;
        if (i === list.length - 1) {
            // last element
            joiner = '';
        } else if (i === list.length - 2) {
            joiner = list.length === 2 ? ' and ' : ', and ';
        } else {
            joiner = ', ';
        }
        result += `${list[i]}${joiner}`;
    }

    return result;
};

export const isTeacherBlock = (block: Block): boolean => {
    return block !== Block.WIN && block !== Block.LION && block !== Block.TIGER;
};

export const toTeacherBlockUnsafe = (block: Block): TeacherBlock => {
    return block as unknown as TeacherBlock;
};

export const extractTeacherBlocks = (
    schedule: DaySchedule | undefined,
): TeacherBlock[] => {
    if (!schedule) return [];

    const result: TeacherBlock[] = [];
    schedule.schedule.forEach(({ block }) => {
        if (isTeacherBlock(block)) {
            result.push(block as unknown as TeacherBlock);
        }
    });

    return result;
};

export const extractDayBlocks = (
    schedule: DaySchedule | undefined,
): Block[] => {
    if (!schedule) return [];

    return schedule.schedule.map(({ block }) => block);
};

export const isLongShortBlockName = (block: Block): boolean => {
    return (
        block === Block.WIN ||
        block === Block.LION ||
        block === Block.TIGER ||
        block === Block.ADVISORY
    );
};

export const shuffleArray = (array: Array<any>) => {
    const newArray = array;
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [array[j], array[i]];
    }
    return newArray;
};
