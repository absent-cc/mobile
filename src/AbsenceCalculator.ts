import {
    AbsenceList,
    AbsentTeacher,
    Block,
    Schedule,
    SchoolName,
    Teacher,
} from './api/APITypes';

export type AbsenceItem = {
    block: Block;
    isFree: boolean;
    teacher?: AbsentTeacher;
};

export default (
    schedule: Schedule,
    blocksToday: Block[],
    absences: AbsenceList,
    includeFrees: boolean,
): { teachersAbsent: AbsenceItem[]; extraAbsent: AbsenceItem[] } => {
    // return {
    //     teachersAbsent: [
    //         {
    //             block: Block.C,
    //             isFree: false,
    //             teacher: {
    //                 teacher: {
    //                     tid: 'y',
    //                     name: 'Samuel Thomas',
    //                     school: SchoolName.NSHS,
    //                 },
    //                 time: 'All Day',
    //                 note: 'All classes cancelled today. Check Schoology.',
    //             },
    //         },
    //         {
    //             block: Block.F,
    //             isFree: true,
    //         },
    //     ],
    //     extraAbsent: [],
    // };

    return {
        teachersAbsent: [],
        extraAbsent: [
            {
                block: Block.EXTRA,
                isFree: false,
                teacher: {
                    teacher: {
                        tid: 'y',
                        name: 'Katherine Osorio',
                        school: SchoolName.NSHS,
                    },
                    time: 'All Day',
                    note: 'C, F, G cancelled. No track practice after school.',
                },
            },
        ],
    };
};
