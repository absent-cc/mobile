import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TextButton from './button/TextButton';
import TeacherField from './TeacherField';

function ExtraTeachers({
    onChange,
    style,
    defaultValue,
    scrollRef,
}: {
    onChange: (newSettings: string[]) => void;
    style?: any;
    defaultValue: string[];
    scrollRef: React.MutableRefObject<ScrollView | null>;
}) {
    const changeFunc = React.useRef(onChange);

    // unique key for teacher list
    const teacherTotalNum = React.useRef(0);

    const [value, setValue] = React.useState<
        {
            id: number;
            teacher: string;
        }[]
    >(
        defaultValue.map((teacher) => {
            // this means the first one will be 1 but that doesn't matter
            teacherTotalNum.current += 1;
            return { id: teacherTotalNum.current, teacher };
        }),
    );

    // bubble up on update
    React.useEffect(() => {
        changeFunc.current(value.map((teacherObj) => teacherObj.teacher));
    }, [value]);

    const removeTeacher = (index: number) => {
        // delete nth teacher
        const teachers = [...value];
        teachers.splice(index, 1);

        setValue(teachers);
    };
    const addTeacher = () => {
        setValue([...value, { id: teacherTotalNum.current + 1, teacher: '' }]);
        teacherTotalNum.current += 1;
    };
    const setTeacher = (index: number, newTeacher: string) => {
        const teachers = [...value];
        teachers[index].teacher = newTeacher;

        setValue(teachers);
    };

    const teachersList = value.map((teacher, index) => {
        return (
            <View
                style={[styles.teacherInput, { zIndex: value.length - index }]}
                key={teacher.id}
            >
                <TeacherField
                    onChange={(newTeacher) => {
                        setTeacher(index, newTeacher);
                    }}
                    style={styles.teacherInputText}
                    defaultValue={teacher.teacher}
                    deletable
                    onDelete={() => {
                        removeTeacher(index);
                    }}
                    scrollRef={scrollRef}
                />
            </View>
        );
    });

    return (
        <View style={style}>
            {teachersList}

            <TextButton
                style={styles.inputField}
                iconName="plus"
                onPress={addTeacher}
            >
                Add Teacher
            </TextButton>
        </View>
    );
}

const styles = StyleSheet.create({
    inputField: {
        marginTop: 10,
    },
    teacherInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    teacherInputText: {
        flex: 1,
    },
    teacherInputDelete: {
        flex: 0,
        marginLeft: 10,
    },
});

export default ExtraTeachers;
