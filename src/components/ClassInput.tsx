import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../Theme';
import { BlockMapping } from '../Utils';
import TextButton from './button/TextButton';
import SwitchField from './input/Switch';
import { Block } from '../api/APITypes';
import TeacherField from './TeacherField';
import ErrorCard from './card/ErrorCard';

function ClassInput({
    block,
    style,
    onChange,
    isInvalid,
    defaultValue,
    scrollRef,
}: {
    block: Block;
    style?: any;
    onChange: (block: Block, newSettings: string[]) => void;
    isInvalid: boolean;
    defaultValue: string[];
    scrollRef: React.MutableRefObject<ScrollView | null>;
}) {
    const changeFunc = React.useRef(onChange);
    React.useEffect(() => {
        changeFunc.current = onChange;
    }, [onChange]);

    // foldable
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
    // unique key for teacher list
    const teacherTotalNum = React.useRef(0);

    const [value, setValue] = React.useState<{
        isFree: boolean;
        teachers: {
            id: number;
            teacher: string;
        }[];
    }>(() => ({
        // basically, if i get an empty array, it's free, otherwise there's a list
        isFree: defaultValue.length === 0,
        teachers:
            defaultValue.length === 0
                ? [{ id: teacherTotalNum.current, teacher: '' }]
                : defaultValue.map((teacher) => {
                      // this means the first one will be 1 but that doesn't matter
                      teacherTotalNum.current += 1;
                      return {
                          id: teacherTotalNum.current,
                          teacher,
                          //   teacher: teacher.toString(),
                      };
                  }),
    }));

    const setFree = (isFree: boolean) => {
        setValue({
            ...value,
            isFree,
        });
    };

    // bubble up on update
    React.useEffect(() => {
        changeFunc.current(
            block,
            value.isFree
                ? []
                : value.teachers.map((teacherObj) => teacherObj.teacher),
        );
    }, [value, block]);

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
                { id: teacherTotalNum.current + 1, teacher: '' },
            ],
        });
        teacherTotalNum.current += 1;
    };
    const setTeacher = (index: number, teacher: string) => {
        const teachers = [...value.teachers];
        teachers[index].teacher = teacher;

        setValue({
            ...value,
            teachers,
        });
    };

    const teachersList = value.teachers.map((teacher, index) => {
        return (
            <View
                style={[
                    styles.teacherInput,
                    { zIndex: value.teachers.length - index + 1 },
                ]}
                key={teacher.id}
            >
                <TeacherField
                    onChange={(newTeacher) => {
                        setTeacher(index, newTeacher);
                    }}
                    defaultValue={teacher.teacher}
                    deletable={index > 0}
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
            <Pressable style={styles.header} onPress={toggleOpen}>
                <Feather
                    style={[styles.closeIcon]}
                    name={isOpen ? 'chevron-down' : 'chevron-right'}
                    size={30}
                />
                <Text
                    style={[
                        styles.title,
                        isInvalid ? styles.invalidTitle : null,
                    ]}
                >
                    {BlockMapping[block]}
                </Text>
                {isInvalid ? (
                    <Feather
                        style={[styles.invalidIcon]}
                        name="alert-octagon"
                        size={30}
                    />
                ) : null}
            </Pressable>

            {isOpen ? (
                <>
                    {isInvalid ? (
                        <ErrorCard>
                            Please make sure you've entered all your teachers
                            correctly or mark this as a free block.
                        </ErrorCard>
                    ) : null}

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
                                    style={[styles.inputField, { zIndex: 1 }]}
                                    iconName="plus"
                                    onPress={addTeacher}
                                >
                                    Add Teacher
                                </TextButton>
                            </>
                        )}
                    </View>
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    closeIcon: {
        color: Theme.lightForeground,
        marginRight: 3,
    },
    title: {
        fontFamily: Theme.strongFont,
        fontSize: 24,
        flex: 1,
        color: Theme.foregroundColor,
    },
    invalidTitle: {
        color: Theme.primaryColor,
    },
    invalidIcon: {
        color: Theme.primaryColor,
        marginRight: 3,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    teacherInput: {
        marginTop: 10,
    },
});

export default ClassInput;
