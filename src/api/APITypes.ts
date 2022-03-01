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
