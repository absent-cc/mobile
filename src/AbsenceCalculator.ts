import {
    AbsenceList,
    AbsentTeacher,
    Block,
    Schedule,
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
    const result: AbsenceItem[] = [];
    blocksToday.forEach((block) => {
        const teachers: Teacher[] = schedule[block];
        // add free blocks
        if (teachers.length === 0) {
            if (includeFrees) {
                result.push({
                    block,
                    isFree: true,
                });
            }
        } else {
            teachers.forEach((teacher) => {
                // check if teacher is in list
                const absentTeacher = absences.find(
                    (teach) => teach.name === teacher.name,
                );
                if (absentTeacher) {
                    result.push({
                        block,
                        isFree: false,
                        teacher: absentTeacher,
                    });
                }
            });
        }
    });

    const extras: AbsenceItem[] = [];
    if (schedule.EXTRA.length > 0) {
        schedule.EXTRA.forEach((teacher) => {
            // check if teacher is in list
            const absentTeacher = absences.find(
                (teach) => teach.name === teacher.name,
            );
            if (absentTeacher) {
                result.push({
                    block: Block.EXTRA,
                    isFree: false,
                    teacher: absentTeacher,
                });
            }
        });
    }

    return {
        teachersAbsent: result,
        extraAbsent: extras,
    };
};
