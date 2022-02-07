export enum SchoolName {
    NONE = '',
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
    ADV = 'ADV',
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
    uid: string;
    name: string;
    school: SchoolName;
    grade: Grade;
};

export type AbsentTeacher = {
    name: string;
    time: string;
    notes: string;
};

export type AbsenceList = AbsentTeacher[];
