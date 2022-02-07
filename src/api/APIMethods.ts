import {
    AbsenceList,
    Block,
    EditingSchedule,
    Grade,
    Schedule,
    SchoolName,
    Teacher,
    UserSettings,
} from './APITypes';

// testing stuff
const teachers: Teacher[] = [
    {
        tid: '123849299',
        name: 'Mary McDonald',
        school: SchoolName.NSHS,
    },
    {
        tid: '123843299',
        name: 'Sara Tare',
        school: SchoolName.NSHS,
    },
    {
        tid: '123499299',
        name: 'Ron Dreg',
        school: SchoolName.NSHS,
    },
    {
        tid: '123842399',
        name: 'Alex Zabo',
        school: SchoolName.NSHS,
    },
    {
        tid: '123849205',
        name: 'Don Fir',
        school: SchoolName.NSHS,
    },
    {
        tid: '193849299',
        name: 'Mark Secon',
        school: SchoolName.NSHS,
    },
    {
        tid: '1238448299',
        name: 'Grant Antwerp',
        school: SchoolName.NSHS,
    },
    {
        tid: '153849299',
        name: 'Greg Trough',
        school: SchoolName.NSHS,
    },
    {
        tid: '123194829',
        name: 'Simone Eureka',
        school: SchoolName.NSHS,
    },
];

const userSettings = {
    user: {
        uid: '1234567890',
        name: 'Sydney Carton',
        school: SchoolName.NSHS,
        grade: Grade.G10,
    },
    schedule: {
        A: [
            {
                tid: '123194829',
                name: 'Simone Eureka',
                school: SchoolName.NSHS,
            },
        ],
        B: [
            {
                tid: '153849299',
                name: 'Greg Trough',
                school: SchoolName.NSHS,
            },
        ],
        C: [
            {
                tid: '1238448299',
                name: 'Grant Antwerp',
                school: SchoolName.NSHS,
            },
        ],
        D: [
            {
                tid: '123849205',
                name: 'Don Fir',
                school: SchoolName.NSHS,
            },
            {
                tid: '193849299',
                name: 'Mark Secon',
                school: SchoolName.NSHS,
            },
        ],
        E: [
            {
                tid: '123499299',
                name: 'Ron Dreg',
                school: SchoolName.NSHS,
            },
            {
                tid: '123842399',
                name: 'Alex Zabo',
                school: SchoolName.NSHS,
            },
        ],
        F: [],
        G: [
            {
                tid: '123843299',
                name: 'Sara Tare',
                school: SchoolName.NSHS,
            },
        ],
        ADV: [
            {
                tid: '123849299',
                name: 'Mary McDonald',
                school: SchoolName.NSHS,
            },
        ],
        EXTRA: [],
    },
};

const baseURL = 'https://api.absent.cc';
const urls = {
    login: '/login',
};

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export async function fetchAbsences(token: string): Promise<AbsenceList> {
    const times = ['All Day', 'Partial Day AM', 'Partial Day PM'];
    const notes = [
        'All classes cancelled.',
        'Classes as usual',
        'A, B, C, Advisory Cancelled',
    ];
    const response: AbsenceList = [];

    teachers.forEach((teacher) => {
        if (Math.random() > 0.8) {
            response.push({
                name: teacher.name,
                time: times[Math.floor(Math.random() * times.length)],
                notes: notes[Math.floor(Math.random() * notes.length)],
            });
        }
    });

    return response;
}

export async function fetchSettings(
    token: string,
): Promise<{ user: UserSettings; schedule: Schedule }> {
    return userSettings;
}

export async function saveSettings(
    newSettings: { user: UserSettings; schedule: EditingSchedule },
    token: string,
): Promise<{ user: UserSettings; schedule: Schedule }> {
    return userSettings;
}

export async function saveSchedule(
    newSettings: EditingSchedule,
    token: string,
): Promise<Schedule> {
    return userSettings.schedule;
}

export async function saveUserSettings(
    newSettings: UserSettings,
    token: string,
): Promise<UserSettings> {
    return userSettings.user;
}

export async function logout(token: string) {
    // TODO
}

export async function searchTeachers(
    searchString: string,
    token: string,
): Promise<Teacher[]> {
    return teachers.filter((teacher) =>
        teacher.name.toLowerCase().startsWith(searchString.toLowerCase()),
    );
}

export async function isRealTeacher(
    partialName: string,
    token: string,
): Promise<{
    isReal: boolean;
    similar: string[];
}> {
    const exactMatch = teachers.filter(
        (teacher) => teacher.name.toLowerCase() === partialName.toLowerCase(),
    );
    if (exactMatch.length > 0) {
        return {
            isReal: true,
            similar: [exactMatch[0].name],
        };
    }

    // there's no exact match, so get similar ones
    const results = teachers.filter((teacher) =>
        teacher.name.toLowerCase().startsWith(partialName.toLowerCase()),
    );

    return {
        isReal: false,
        similar: results.map((teacher) => teacher.name).slice(0, 2),
    };
}

export async function getClassesToday(token: string): Promise<Block[]> {
    return [Block.A, Block.B, Block.F, Block.G];
}

export async function login(accessToken: string): Promise<string> {
    return 'thisisatoken';
}
