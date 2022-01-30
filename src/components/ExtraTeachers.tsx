import React from 'react';
import { StyleSheet, View } from 'react-native';
import IconButton from './button/IconButton';
import TextButton from './button/TextButton';
import TextField from './input/TextField';

interface Teacher {
    id: number;
    name: string;
}

function ExtraTeachers({ style }: { style?: any }) {
    // unique key for teacher list
    const [teacherTotalNum, setTeacherTotalNum] = React.useState(0);
    const [value, setValue] = React.useState<Teacher[]>([]);

    const removeTeacher = (index: number) => {
        // delete nth teacher
        const teachers = [...value];
        teachers.splice(index, 1);

        setValue(teachers);
    };
    const addTeacher = () => {
        setValue([...value, { id: teacherTotalNum + 1, name: '' }]);
        setTeacherTotalNum(teacherTotalNum + 1);
    };
    const setTeacher = (index: number, name: string) => {
        const teachers = [...value];
        teachers[index].name = name;

        setValue(teachers);
    };

    const teachersList = value.map((teacher, index) => {
        return (
            <View style={styles.teacherInput} key={teacher.id}>
                <TextField
                    onChange={(name) => {
                        setTeacher(index, name);
                    }}
                    placeholder="e.g. Rebecca Realson"
                    style={styles.teacherInputText}
                    defaultValue={teacher.name}
                />
                <IconButton
                    style={styles.teacherInputDelete}
                    onPress={() => {
                        removeTeacher(index);
                    }}
                    iconName="trash-2"
                    isFilled
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
