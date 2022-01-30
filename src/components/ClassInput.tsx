import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../Theme';
import { BlockMapping } from '../Utils';
import IconButton from './button/IconButton';
import TextButton from './button/TextButton';
import SwitchField from './input/Switch';
import TextField from './input/TextField';
import { Block } from '../api/APITypes';

function ClassInput({ blockId, style }: { blockId: Block; style?: any }) {
    // foldable
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    // unique key for teacher list
    const [teacherTotalNum, setTeacherTotalNum] = React.useState(0);
    const [value, setValue] = React.useState({
        isFree: false,
        teachers: [{ id: 0, name: '' }],
    });
    const setFree = (isFree: boolean) => {
        setValue({
            ...value,
            isFree,
        });
    };
    const removeTeacher = (index: number) => {
        // delete nth teacher
        const teachers = [...value.teachers];
        teachers.splice(index, 1);

        setValue({
            ...value,
            teachers,
        });
    };
    const addTeacher = () => {
        setValue({
            ...value,
            teachers: [
                ...value.teachers,
                { id: teacherTotalNum + 1, name: '' },
            ],
        });
        setTeacherTotalNum(teacherTotalNum + 1);
    };
    const setTeacher = (index: number, name: string) => {
        const teachers = [...value.teachers];
        teachers[index].name = name;

        setValue({
            ...value,
            teachers,
        });
    };

    const teachersList = value.teachers.map((teacher, index) => {
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
                {index > 0 ? (
                    <IconButton
                        style={styles.teacherInputDelete}
                        onPress={() => {
                            removeTeacher(index);
                        }}
                        iconName="trash-2"
                        isFilled
                    />
                ) : null}
            </View>
        );
    });

    return (
        <View style={style}>
            <Pressable style={styles.header} onPress={toggleOpen}>
                <Feather
                    style={[styles.closeIcon]}
                    name={isOpen ? 'chevron-down' : 'chevron-right'}
                    size={30}
                />
                <Text style={styles.title}>{BlockMapping[blockId]}</Text>
            </Pressable>

            {isOpen ? (
                <View style={styles.content}>
                    <SwitchField
                        label="Free block?"
                        defaultValue={value.isFree}
                        onChange={setFree}
                    />
                    {value.isFree ? null : (
                        <>
                            <Text style={styles.teachers}>Teachers</Text>

                            {teachersList}

                            <TextButton
                                style={styles.inputField}
                                iconName="plus"
                                onPress={addTeacher}
                            >
                                Add Teacher
                            </TextButton>
                        </>
                    )}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: Theme.strongFont,
        fontSize: 24,
    },
    content: {
        width: '90%',
        marginHorizontal: '5%',
        marginTop: 20,
    },
    teachers: {
        fontFamily: Theme.strongFont,
        fontSize: 16,
        marginTop: 16,
    },
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    closeIcon: {
        color: Theme.lightForeground,
        marginRight: 3,
    },
});

export default ClassInput;
