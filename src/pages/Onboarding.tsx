import { StyleSheet, Text, ScrollView, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';
import Divider from '../components/Divider';
import TextField from '../components/input/TextField';
import Dropdown from '../components/input/Dropdown';
import TextButton from '../components/button/TextButton';
import WaveHeader from '../components/header/WaveHeader';
import ClassInput from '../components/ClassInput';
import ExtraTeachers from '../components/ExtraTeachers';
import WaveHeaderSafearea from '../components/header/WaveHeaderSafearea';
import { Block, Grade, SchoolName, Teacher } from '../api/APITypes';
import { useSettings } from '../state/SettingsContext';
import { EmptySchedule, EmptyUser, joinName, splitName } from '../Utils';
import ErrorCard from '../components/card/ErrorCard';

function Onboarding({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const settings = useSettings();

    const [teacherSettings, setTeacherSettings] = React.useState(EmptySchedule);
    const [userSettings, setUserSettings] = React.useState(EmptyUser);

    const updateBlock = (block: Block, newData: Teacher[]) => {
        setTeacherSettings((oldSettings) => ({
            ...oldSettings,
            block: newData,
        }));
    };

    // validation
    const [validationList, setValidationList] = React.useState({
        existsInvalid: false,
        name: false,
        grade: false,
        school: false,
        a: false,
        b: true,
        c: false,
        d: false,
        e: false,
        f: false,
        g: false,
        adv: false,
    });

    const validate = (): boolean => {
        const newValidationList = { ...validationList };
        // newValidationList.name =
        //     joinName(userSettings.first, userSettings.last).length < 1;
        newValidationList.grade = userSettings.grade !== Grade.NONE;
        newValidationList.school = userSettings.school !== SchoolName.NONE;

        // summary
        newValidationList.existsInvalid =
            Object.values(newValidationList).includes(true);

        setValidationList(newValidationList);

        return newValidationList.existsInvalid;
    };

    const save = () => {
        if (validate()) {
            settings.setSettings((oldSettings) => ({
                ...oldSettings,
                schedule: teacherSettings,
                user: userSettings,
            }));
        }
    };

    return (
        <View style={styles.pageView}>
            <WaveHeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
                keyboardShouldPersistTaps="handled"
            >
                <WaveHeader
                    text="Welcome! 👋"
                    iconName="x"
                    iconClick={() => {
                        navigation.goBack('Home');
                    }}
                />
                <View style={styles.content}>
                    <Text style={styles.text}>Let's set up your account.</Text>
                    <Divider />
                    <Text style={styles.header}>Your Profile</Text>
                    <Text style={styles.note}>Let's get to know you.</Text>
                    <TextField
                        label="What's your name?"
                        onChange={(newValue: string) => {
                            const split = splitName(newValue);
                            setUserSettings((oldSettings) => ({
                                ...oldSettings,
                                first: split[0],
                                last: split[1],
                            }));
                        }}
                        placeholder="e.g. Kevin McFakehead"
                        style={[styles.inputField, { zIndex: 13 }]}
                    />
                    {validationList.name ? (
                        <ErrorCard>Please enter your name.</ErrorCard>
                    ) : null}
                    <Dropdown
                        label="What grade are you in?"
                        onChange={(newValue: number) => {
                            const options = [
                                Grade.G9,
                                Grade.G10,
                                Grade.G11,
                                Grade.G12,
                            ];
                            setUserSettings((oldSettings) => ({
                                ...oldSettings,
                                grade: options[newValue],
                            }));
                        }}
                        style={[styles.inputField, { zIndex: 12 }]}
                        placeholder="Select a grade"
                        options={['9', '10', '11', '12']}
                        defaultValue={-1}
                    />
                    {validationList.grade ? (
                        <ErrorCard>Please select a grade.</ErrorCard>
                    ) : null}
                    <Dropdown
                        label="Which school do you go to?"
                        onChange={(newValue: number) => {
                            const options = [SchoolName.NSHS, SchoolName.NNHS];
                            setUserSettings((oldSettings) => ({
                                ...oldSettings,
                                school: options[newValue],
                            }));
                        }}
                        style={[styles.inputField, { zIndex: 11 }]}
                        placeholder="Select a school"
                        options={['South', 'North']}
                        defaultValue={-1}
                    />
                    {validationList.school ? (
                        <ErrorCard>Please select a school.</ErrorCard>
                    ) : null}
                    <Divider />
                    <Text style={styles.header}>Classes</Text>
                    <Text style={styles.note}>
                        Tap on each block to set up your classes.
                    </Text>

                    <ClassInput
                        style={[styles.classInput, { zIndex: 10 }]}
                        block={Block.A}
                        onChange={updateBlock}
                        isInvalid={validationList.a}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 9 }]}
                        block={Block.B}
                        onChange={updateBlock}
                        isInvalid={validationList.b}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 8 }]}
                        block={Block.C}
                        onChange={updateBlock}
                        isInvalid={validationList.c}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 7 }]}
                        block={Block.D}
                        onChange={updateBlock}
                        isInvalid={validationList.d}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 6 }]}
                        block={Block.E}
                        onChange={updateBlock}
                        isInvalid={validationList.e}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 5 }]}
                        block={Block.F}
                        onChange={updateBlock}
                        isInvalid={validationList.f}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 4 }]}
                        block={Block.G}
                        onChange={updateBlock}
                        isInvalid={validationList.g}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 3 }]}
                        block={Block.ADV}
                        onChange={updateBlock}
                        isInvalid={validationList.adv}
                    />

                    <Text style={styles.header}>Extra Teachers</Text>
                    <Text style={styles.note}>
                        Extra teachers allows you to keep track of attendance
                        for other teachers at school.
                    </Text>

                    <ExtraTeachers
                        style={[{ zIndex: 2 }]}
                        onChange={(newSettings) => {
                            updateBlock(Block.EXTRA, newSettings);
                        }}
                    />
                    <Divider />

                    {validationList.existsInvalid ? (
                        <ErrorCard>
                            Please check the info you entered and try again.
                        </ErrorCard>
                    ) : null}
                    <TextButton
                        style={[styles.getStarted, { zIndex: 1 }]}
                        iconName="check-circle"
                        onPress={() => {
                            save();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        }}
                        isFilled
                    >
                        Get Started!
                    </TextButton>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    content: {
        paddingHorizontal: 30,
        paddingTop: 5,
        paddingBottom: 300,
    },
    text: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 16,
        marginBottom: 16,
    },
    header: {
        color: Theme.foregroundColor,
        fontFamily: Theme.strongFont,
        fontSize: 30,
        marginBottom: 3,
    },
    inputField: {
        marginTop: 20,
    },
    classInput: {
        marginTop: 10,
        marginBottom: 20,
    },
    getStarted: {
        marginTop: 20,
    },
});

export default Onboarding;
