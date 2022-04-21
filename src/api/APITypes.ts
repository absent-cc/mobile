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

export enum TeacherBlock {
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

export enum Block {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
    ADVISORY = 'ADVISORY',
    WIN = 'WIN',
    LION = 'LION',
    TIGER = 'TIGER',
}

export type Teacher = {
    tid: string;
    name: string;
    school: SchoolName;
};

export type Schedule = {
    [key in TeacherBlock]: Teacher[];
};

export type EditingSchedule = {
    [key in TeacherBlock]: string[];
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
    startTime: number;
    endTime: number;
};

export type DayBlock = {
    block: Block;
    startTime: number;
    endTime: number;
    lunches: Lunch[] | null;
};

export type DaySchedule = {
    date: string;
    name: string;
    note: string;
    special: boolean;
    schedule: DayBlock[];
};

export type WeekSchedule = Record<string, DaySchedule>;
