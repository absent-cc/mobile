import { formatISODate } from '../DateWordUtils';
import { AppSettings } from '../state/SettingsContext';
import {
    AbsenceList,
    Block,
    LunchType,
    Schedule,
    SchoolName,
    UserSettings,
    WeekSchedule,
} from './APITypes';

export const DEMO_TOKEN = 'DEMO_TOKEN';
export const DEMO_REFRESH = 'DEMO_REFRESH';

export const DEMO_ABSENCE_LIST: AbsenceList = [
    {
        time: 'All Day',
        note: 'A block cancelled; reschedule WINs',
        teacher: {
            tid: '12984002',
            school: SchoolName.NSHS,
            name: 'Brian Baron',
            reversedSplitName: ['Baron', 'Brian'],
        },
    },
    {
        time: 'All Day',
        note: null,
        teacher: {
            tid: 'e8d3a1ff',
            school: SchoolName.NSHS,
            name: 'Paul Belenky',
            reversedSplitName: ['Belenky', 'Paul'],
        },
    },
    {
        time: 'All Day',
        note: null,
        teacher: {
            tid: '54416cd6',
            school: SchoolName.NSHS,
            name: 'Courtney Brooks',
            reversedSplitName: ['Brooks', 'Courtney'],
        },
    },
    {
        time: 'All Day',
        note: 'Classes Cancelled, see Schoology for for work',
        teacher: {
            tid: '1ae431d0',
            school: SchoolName.NSHS,
            name: 'Kimberly Curtis',
            reversedSplitName: ['Curtis', 'Kimberly'],
        },
    },
    {
        time: 'All Day',
        note: 'WIN please reschedule yourselves',
        teacher: {
            tid: '6a1431c6',
            school: SchoolName.NSHS,
            name: 'David Kershaw',
            reversedSplitName: ['Kershaw', 'David'],
        },
    },
    {
        time: 'All Day',
        note: 'G block canceled',
        teacher: {
            tid: '15c9aec0',
            school: SchoolName.NSHS,
            name: 'Jeffrey Knoedler',
            reversedSplitName: ['Knoedler', 'Jeffrey'],
        },
    },
    {
        time: 'All Day',
        note: 'A Block, B Block and E Block are cancelled. Go to lecture hall. WIN2 please reschedule yourselves.',
        teacher: {
            tid: 'b57da3db',
            school: SchoolName.NSHS,
            name: 'Dianna Kobayashi',
            reversedSplitName: ['Kobayashi', 'Dianna'],
        },
    },
    {
        time: 'All Day',
        note: null,
        teacher: {
            tid: '64173393',
            school: SchoolName.NSHS,
            name: 'Kevin Lenane',
            reversedSplitName: ['Lenane', 'Kevin'],
        },
    },
    {
        time: 'All Day',
        note: 'A and E blocks cancelled; WIN reschedule yourself',
        teacher: {
            tid: 'd18f86c9',
            school: SchoolName.NSHS,
            name: 'Tonya Londino',
            reversedSplitName: ['Londino', 'Tonya'],
        },
    },
    {
        time: 'All Day',
        note: 'B, E, and G cancelled.WIN, reschedule.',
        teacher: {
            tid: 'ba7b3fd3',
            school: SchoolName.NSHS,
            name: 'Maureen Maher',
            reversedSplitName: ['Maher', 'Maureen'],
        },
    },
    {
        time: 'All Day',
        note: null,
        teacher: {
            tid: '8a17b097',
            school: SchoolName.NSHS,
            name: 'Rachael Mcnally',
            reversedSplitName: ['Mcnally', 'Rachael'],
        },
    },
    {
        time: 'All Day',
        note: 'A3 and E3 canceled. A block study for test Monday (be on time). E block finish review work per Schoology.',
        teacher: {
            tid: 'ec3291f4',
            school: SchoolName.NSHS,
            name: 'Thomas Raubach',
            reversedSplitName: ['Raubach', 'Thomas'],
        },
    },
    {
        time: 'All Day',
        note: null,
        teacher: {
            tid: '74782897',
            school: SchoolName.NSHS,
            name: 'Daniel Rubin',
            reversedSplitName: ['Rubin', 'Daniel'],
        },
    },
    {
        time: 'All Day',
        note: null,
        teacher: {
            tid: '8c58b6aa',
            school: SchoolName.NSHS,
            name: 'Tary Scott Jr',
            reversedSplitName: ['Scott Jr', 'Tary'],
        },
    },
    {
        time: 'Partial Day AM',
        note: "B Block CancelledE Block, I'm Here!",
        teacher: {
            tid: '2ffcdaa2',
            school: SchoolName.NSHS,
            name: 'Helena Alfonzo',
            reversedSplitName: ['Alfonzo', 'Helena'],
        },
    },
    {
        time: 'Partial Day AM',
        note: 'A Block cancelled (freshman to Cancelled Class); G Block as usual',
        teacher: {
            tid: 'dac42b5e',
            school: SchoolName.NSHS,
            name: 'Jennifer Hee',
            reversedSplitName: ['Hee', 'Jennifer'],
        },
    },
    {
        time: 'Partial Day PM',
        note: null,
        teacher: {
            tid: '8222c114',
            school: SchoolName.NSHS,
            name: 'Marguerite Monahan',
            reversedSplitName: ['Monahan', 'Marguerite'],
        },
    },
];

export const DEMO_SETTINGS: {
    uid: string;
    user: UserSettings;
    schedule: Schedule;
    app: AppSettings;
} = {
    uid: '735ff82f-a126-474b-a6f6-29f9c0dff332',
    user: { name: 'Demo User', school: SchoolName.NSHS, grade: 11 },
    schedule: {
        A: [
            {
                tid: '3a1a7655',
                name: 'Lily Eng Shine',
                school: SchoolName.NSHS,
                reversedSplitName: ['Eng Shine', 'Lily'],
            },
        ],
        B: [
            {
                tid: '74975a0a',
                name: 'Joseph Golding',
                school: SchoolName.NSHS,
                reversedSplitName: ['Golding', 'Joseph'],
            },
            {
                tid: '8b395944',
                name: 'Charles Petrizzi',
                school: SchoolName.NSHS,
                reversedSplitName: ['Petrizzi', 'Charles'],
            },
        ],
        C: [
            {
                tid: 'f62ef97c',
                name: 'Tamar Brendzel',
                school: SchoolName.NSHS,
                reversedSplitName: ['Brendzel', 'Tamar'],
            },
            {
                tid: 'fc232fe1',
                name: 'Andrew Thompson',
                school: SchoolName.NSHS,
                reversedSplitName: ['Thompson', 'Andrew'],
            },
        ],
        D: [
            {
                tid: 'd18f86c9',
                name: 'Tonya Londino',
                school: SchoolName.NSHS,
                reversedSplitName: ['Londino', 'Tonya'],
            },
            {
                tid: '00d4c4f5',
                name: 'Emma Leslie',
                school: SchoolName.NSHS,
                reversedSplitName: ['Leslie', 'Emma'],
            },
        ],
        E: [
            {
                tid: 'a1b4cdc4',
                name: 'Linda Kraus',
                school: SchoolName.NSHS,
                reversedSplitName: ['Kraus', 'Linda'],
            },
            {
                tid: '413ec0f8',
                name: 'Teresa Marshall',
                school: SchoolName.NSHS,
                reversedSplitName: ['Marshall', 'Teresa'],
            },
        ],
        F: [
            {
                tid: '2ffcdaa2',
                name: 'Helena Alfonzo',
                school: SchoolName.NSHS,
                reversedSplitName: ['Alfonzo', 'Helena'],
            },
            {
                tid: 'dadcda0b',
                name: 'Ryan Normandin',
                school: SchoolName.NSHS,
                reversedSplitName: ['Normandin', 'Ryan'],
            },
        ],
        G: [
            {
                tid: 'dadcda0b',
                name: 'Ryan Normandin',
                school: SchoolName.NSHS,
                reversedSplitName: ['Normandin', 'Ryan'],
            },
            {
                tid: '130d4d8e',
                name: 'Mark Rice',
                school: SchoolName.NSHS,
                reversedSplitName: ['Rice', 'Mark'],
            },
        ],
        ADVISORY: [
            {
                tid: '4cf3ce68',
                name: 'Margot Murphy',
                school: SchoolName.NSHS,
                reversedSplitName: ['Murphy', 'Margot'],
            },
            {
                tid: 'de504857',
                name: 'Samuel Lee',
                school: SchoolName.NSHS,
                reversedSplitName: ['Lee', 'Samuel'],
            },
        ],
        EXTRA: [
            {
                tid: 'b62baf92',
                name: 'Victoria Perkinson',
                school: SchoolName.NSHS,
                reversedSplitName: ['Perkinson', 'Victoria'],
            },
            {
                tid: '7ab7ea0a',
                name: 'Ryan Spruck',
                school: SchoolName.NSHS,
                reversedSplitName: ['Spruck', 'Ryan'],
            },
            {
                tid: '15c9aec0',
                name: 'Jeffrey Knoedler',
                school: SchoolName.NSHS,
                reversedSplitName: ['Knoedler', 'Jeffrey'],
            },
        ],
    },
    app: {
        showFreeBlocks: true,
        sendNotifications: true,
        sendNoAbsenceNotification: true,
    },
};

export const DEMO_WEEK_SCHEDULE = [
    {
        date: '2022-10-24',
        name: 'Normal Day',
        schedule: [
            { block: Block.A, startTime: 540, endTime: 605, lunches: null },
            {
                block: Block.ADVISORY,
                startTime: 610,
                endTime: 630,
                lunches: null,
            },
            { block: Block.B, startTime: 635, endTime: 700, lunches: null },
            {
                block: Block.C,
                startTime: 705,
                endTime: 805,
                lunches: [
                    { lunch: LunchType.L1, startTime: 705, endTime: 735 },
                    { lunch: LunchType.L2, startTime: 740, endTime: 770 },
                    { lunch: LunchType.L3, startTime: 775, endTime: 805 },
                ],
            },
            { block: Block.D, startTime: 810, endTime: 875, lunches: null },
            { block: Block.E, startTime: 880, endTime: 945, lunches: null },
        ],
        note: 'No special schedule',
        special: false,
    },
    {
        date: '2022-10-25',
        name: 'Normal Day',
        schedule: [
            { block: Block.A, startTime: 540, endTime: 615, lunches: null },
            { block: Block.B, startTime: 620, endTime: 695, lunches: null },
            {
                block: Block.F,
                startTime: 700,
                endTime: 800,
                lunches: [
                    { lunch: LunchType.L1, startTime: 700, endTime: 730 },
                    { lunch: LunchType.L2, startTime: 735, endTime: 765 },
                    { lunch: LunchType.L3, startTime: 770, endTime: 800 },
                ],
            },
            { block: Block.G, startTime: 805, endTime: 870, lunches: null },
            { block: Block.LION, startTime: 875, endTime: 925, lunches: null },
        ],
        note: 'No special schedule',
        special: false,
    },
    {
        date: '2022-10-26',
        name: 'Normal Day',
        schedule: [
            { block: Block.C, startTime: 540, endTime: 615, lunches: null },
            { block: Block.WIN, startTime: 620, endTime: 670, lunches: null },
            {
                block: Block.D,
                startTime: 675,
                endTime: 785,
                lunches: [
                    { lunch: LunchType.L1, startTime: 675, endTime: 705 },
                    { lunch: LunchType.L2, startTime: 715, endTime: 745 },
                    { lunch: LunchType.L3, startTime: 755, endTime: 785 },
                ],
            },
            { block: Block.E, startTime: 790, endTime: 865, lunches: null },
            { block: Block.F, startTime: 870, endTime: 945, lunches: null },
        ],
        note: 'No special schedule',
        special: false,
    },
    {
        date: '2022-10-27',
        name: 'Normal Day',
        schedule: [
            { block: Block.A, startTime: 540, endTime: 615, lunches: null },
            { block: Block.B, startTime: 620, endTime: 695, lunches: null },
            {
                block: Block.G,
                startTime: 700,
                endTime: 810,
                lunches: [
                    { lunch: LunchType.L1, startTime: 700, endTime: 730 },
                    { lunch: LunchType.L2, startTime: 740, endTime: 770 },
                    { lunch: LunchType.L3, startTime: 780, endTime: 810 },
                ],
            },
            { block: Block.E, startTime: 815, endTime: 890, lunches: null },
            { block: Block.WIN, startTime: 895, endTime: 945, lunches: null },
        ],
        note: 'No special schedule',
        special: false,
    },
    {
        date: '2022-10-28',
        name: 'Normal Day',
        schedule: [
            { block: Block.C, startTime: 540, endTime: 615, lunches: null },
            { block: Block.WIN, startTime: 620, endTime: 670, lunches: null },
            {
                block: Block.D,
                startTime: 675,
                endTime: 785,
                lunches: [
                    { lunch: LunchType.L1, startTime: 675, endTime: 705 },
                    { lunch: LunchType.L2, startTime: 715, endTime: 745 },
                    { lunch: LunchType.L3, startTime: 755, endTime: 785 },
                ],
            },
            { block: Block.F, startTime: 790, endTime: 865, lunches: null },
            { block: Block.G, startTime: 870, endTime: 945, lunches: null },
        ],
        note: 'No special schedule',
        special: false,
    },
];

export const GENERATE_DEMO_WEEK_SCHEDULE = (dateStr: string): WeekSchedule => {
    const dateFromDateStr = new Date(`${dateStr}`);
    const currentDay =
        dateFromDateStr.getDay() +
        (dateFromDateStr.getTimezoneOffset() < 0 ? 1 : 0);

    const result: WeekSchedule = {};

    for (let i = 1; i < 6; i += 1) {
        const distance = i - currentDay;
        const thisDay = new Date(dateFromDateStr);

        thisDay.setDate(thisDay.getDate() + distance);
        const thisDateStr = formatISODate(thisDay);

        result[thisDateStr] = {
            ...DEMO_WEEK_SCHEDULE[i - 1],
            date: thisDateStr,
        };
    }

    return result;
};
