export enum SchoolName {
    NSHS = 'NSHS',
    NNHS = 'NNHS',
}

export enum Grade {
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
}

export type ProfileInfo = {
    first: string;
    last: string;
    school: SchoolName;
    grade: Grade;
};

export type Teacher = {
    tid: string;
    first: string;
    last: string;
    school: SchoolName;
};

export type Schedule = {
    [key in Block]: Teacher[];
};

export type UserSettings = {
    uid: string;
    profile: ProfileInfo;
    schedule: Schedule;
};

export type AbsentTeacher = {
    first: string;
    last: string;
    time: string;
    notes: string;
};

export type AbsenceList = AbsentTeacher[];
