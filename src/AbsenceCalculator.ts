import {
    AbsenceList,
    AbsentTeacher,
    Schedule,
    Teacher,
    TeacherBlock,
} from './api/APITypes';

export type AbsenceItem = {
    block: TeacherBlock;
    isFree: boolean;
    teacher?: AbsentTeacher;
};

export default (
    schedule: Schedule,
    teacherBlocksToday: TeacherBlock[],
    absences: AbsenceList,
    includeFrees: boolean,
): { teachersAbsent: AbsenceItem[]; extraAbsent: AbsenceItem[] } => {
    const result: AbsenceItem[] = [];
    teacherBlocksToday.forEach((block) => {
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
                    (teach) => teach.teacher.tid === teacher.tid,
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
    if (schedule.EXTRA && schedule.EXTRA.length > 0) {
        schedule.EXTRA.forEach((teacher) => {
            // check if teacher is in list
            const absentTeacher = absences.find(
                (teach) => teach.teacher.tid === teacher.tid,
            );
            if (absentTeacher) {
                extras.push({
                    block: TeacherBlock.EXTRA,
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
