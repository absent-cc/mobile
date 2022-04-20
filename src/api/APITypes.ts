export enum SchoolName {
    NONE = 'NONE',
    NSHS = 'NSHS',
    NNHS = 'NNHS',
}

export enum Grade {
    NONE = -1,
    G9 = 9,
    G10 = 10,
    G11 = 11,
    G12 = 12,
}

export enum Block {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    ADVISORY = 'ADVISORY',
    EXTRA = 'EXTRA',
}

export type Teacher = {
    tid: string;
    name: string;
    school: SchoolName;
};

export type Schedule = {
    [key in Block]: Teacher[];
};

export type EditingSchedule = {
    [key in Block]: string[];
};

export type UserSettings = {
    name: string;
    school: SchoolName;
    grade: Grade;
};

export type AbsentTeacher = {
    time: string;
    note: string;
    teacher: Teacher;
};

export type AbsenceList = AbsentTeacher[];

export enum LunchType {
    L1 = 'L1',
    L2 = 'L2',
    L3 = 'L3',
}

export type Lunch = {
    lunch: LunchType;
    startTime: string;
    endTime: string;
};

export type DayBlock = {
    block: Block;
    startTime: string;
    endTime: string;
    lunches: Lunch[];
};

export type DaySchedule = {
    date: string;
    name: string;
    note: string;
    special: boolean;
    schedule: DayBlock[];
};

export type WeekSchedule = Record<string, DaySchedule>;
