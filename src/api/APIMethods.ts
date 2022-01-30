import {
    AbsenceList,
    Block,
    Grade,
    SchoolName,
    Teacher,
    UserSettings,
} from './APITypes';

const baseURL = 'https://api.absent.cc';
const urls = {
    login: '/login',
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export async function fetchAbsences(token: string): Promise<AbsenceList> {
    const response = [
        {
            first: 'Abo',
            last: 'Taran',
            time: 'All Day',
            notes: 'All classes cancelled',
        },
        {
            first: 'Grant',
            last: 'Antwerp',
            time: 'Partial Day AM',
            notes: 'A, B, C, Advisory Cancelled',
        },
    ];

    return response;
}

export async function fetchSettings(token: string): Promise<UserSettings> {
    const response = {
        uid: '1234567890',
        profile: {
            first: 'Sydney',
            last: 'Carton',
            school: SchoolName.NSHS,
            grade: Grade.G10,
        },
        schedule: {
            A: [
                {
                    tid: '123194829',
                    first: 'Simone',
                    last: 'Eureka',
                    school: SchoolName.NSHS,
                },
            ],
            B: [
                {
                    tid: '153849299',
                    first: 'Greg',
                    last: 'Trough',
                    school: SchoolName.NSHS,
                },
            ],
            C: [
                {
                    tid: '1238448299',
                    first: 'Grant',
                    last: 'Antwerp',
                    school: SchoolName.NSHS,
                },
            ],
            D: [
                {
                    tid: '123849205',
                    first: 'Don',
                    last: 'Fir',
                    school: SchoolName.NSHS,
                },
                {
                    tid: '193849299',
                    first: 'Mark',
                    last: 'Secon',
                    school: SchoolName.NSHS,
                },
            ],
            E: [
                {
                    tid: '123499299',
                    first: 'Ron',
                    last: 'Dreg',
                    school: SchoolName.NSHS,
                },
                {
                    tid: '123842399',
                    first: 'Alex',
                    last: 'Zabo',
                    school: SchoolName.NSHS,
                },
            ],
            F: [],
            G: [
                {
                    tid: '123843299',
                    first: 'Sara',
                    last: 'Tare',
                    school: SchoolName.NSHS,
                },
            ],
            ADV: [
                {
                    tid: '123849299',
                    first: 'Mary',
                    last: 'McDonald',
                    school: SchoolName.NSHS,
                },
            ],
        },
    };

    return response;
}

export async function logout(token: string) {}

export async function searchTeachers(
    searchString: string,
    token: string,
): Promise<Teacher[]> {
    const teachers = [
        {
            tid: '123849299',
            first: 'Mary',
            last: 'McDonald',
            school: SchoolName.NSHS,
        },
        {
            tid: '123843299',
            first: 'Sara',
            last: 'Tare',
            school: SchoolName.NSHS,
        },
        {
            tid: '123499299',
            first: 'Ron',
            last: 'Dreg',
            school: SchoolName.NSHS,
        },
        {
            tid: '123842399',
            first: 'Alex',
            last: 'Zabo',
            school: SchoolName.NSHS,
        },
        {
            tid: '123849205',
            first: 'Don',
            last: 'Fir',
            school: SchoolName.NSHS,
        },
        {
            tid: '193849299',
            first: 'Mark',
            last: 'Secon',
            school: SchoolName.NSHS,
        },
        {
            tid: '1238448299',
            first: 'Grant',
            last: 'Antwerp',
            school: SchoolName.NSHS,
        },
        {
            tid: '153849299',
            first: 'Greg',
            last: 'Trough',
            school: SchoolName.NSHS,
        },
        {
            tid: '123194829',
            first: 'Simone',
            last: 'Eureka',
            school: SchoolName.NSHS,
        },
    ];

    return teachers.filter((teacher) =>
        `${teacher.first} ${teacher.last}`.startsWith(searchString),
    );
}

export async function getClassesToday(token: string): Promise<Block[]> {
    return [Block.A, Block.B, Block.F, Block.G];
}

export async function login(): Promise<string> {
    return 'thisisatoken';
}
