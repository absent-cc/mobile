import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import Theme from '../../Theme';
import Divider from '../../components/Divider';
import TextButton from '../../components/button/TextButton';
import { EditingSchedule, TeacherBlock } from '../../api/APITypes';
import { useSettings } from '../../state/SettingsContext';
import { BlockIterator } from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import ClassInput from '../../components/ClassInput';
import ExtraTeachers from '../../components/ExtraTeachers';
import { useAPI } from '../../api/APIContext';
import LoadingCard from '../../components/card/LoadingCard';
import WithWaveHeader from '../../components/header/WithWaveHeader';

function ScheduleOnboarding({ navigation }: { navigation: any }) {
    const api = useAPI();
    const settings = useSettings();

    const teacherSettings = React.useRef(
        Object.fromEntries(
            BlockIterator.map((block) => {
                const teachers = settings.value.schedule[block];
                // const teachers = EmptySchedule[block];

                // for the onboarding process, an empty list is NOT a free block
                if (teachers.length === 0) {
                    return [block, block === TeacherBlock.EXTRA ? [] : ['']];
                }
                return [block, teachers.map((teacher) => teacher.name)];
            }),
        ) as EditingSchedule,
    );

    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

    // validation
    // true = invalid, false = valid
    const [validationList, setValidationList] = React.useState({
        existsInvalid: false,
        A: false,
        B: false,
        C: false,
        D: false,
        E: false,
        F: false,
        G: false,
        ADVISORY: false,
        EXTRA: false,
    });

    const invalidBlock = (block: TeacherBlock): boolean => {
        return teacherSettings.current[block].includes('');
    };

    const validate = (): boolean => {
        const newValidationList = { ...validationList, existsInvalid: false };

        newValidationList.A = invalidBlock(TeacherBlock.A);
        newValidationList.B = invalidBlock(TeacherBlock.B);
        newValidationList.C = invalidBlock(TeacherBlock.C);
        newValidationList.D = invalidBlock(TeacherBlock.D);
        newValidationList.E = invalidBlock(TeacherBlock.E);
        newValidationList.F = invalidBlock(TeacherBlock.F);
        newValidationList.G = invalidBlock(TeacherBlock.G);
        newValidationList.ADVISORY = invalidBlock(TeacherBlock.ADVISORY);
        newValidationList.EXTRA = invalidBlock(TeacherBlock.EXTRA);

        // summary
        newValidationList.existsInvalid =
            Object.values(newValidationList).includes(true);

        setValidationList(newValidationList);

        return !newValidationList.existsInvalid;
    };

    const updateBlock = (block: TeacherBlock, newSettings: string[]) => {
        teacherSettings.current[block] = newSettings;

        // when the error gets fixed, the error goes away
        if (validationList[block] && !invalidBlock(block)) {
            const newValidationList = { ...validationList };
            newValidationList[block] = false;
            setValidationList(newValidationList);
        }
    };

    // save stuff to server
    React.useEffect(() => {
        if (saving) {
            api.saveSettings({
                user: settings.value.user,
                schedule: teacherSettings.current,
                app: settings.value.app,
            })
                .then((saveSuccess) => {
                    if (saveSuccess) {
                        settings.setSettings((oldSettings) => ({
                            ...oldSettings,
                            userOnboarded: true,
                        }));
                    } else {
                        setSaving(false);
                        setSaveError(true);
                    }
                })
                .catch(() => {
                    setSaving(false);
                    setSaveError(true);
                });
        }
    }, [saving, api, settings, teacherSettings]);

    // scroll to text inputs
    const scrollViewRef = React.useRef<ScrollView | null>(null);

    return (
        <WithWaveHeader
            style={styles.pageView}
            text="Your Schedule"
            iconName="chevron-left"
            isLeft
            iconClick={() => {
                navigation.goBack();
            }}
            ref={scrollViewRef}
            largeBottom
            reversed
            saveHeaderSize={false}
        >
            <Text style={styles.text}>
                You're almost done, just a few more steps!
            </Text>
            <Divider />

            <Text style={styles.header}>Classes</Text>
            <Text style={styles.note}>
                Tap on each block to set up your classes.
            </Text>

            <ClassInput
                style={[styles.classInput, { zIndex: 10 }]}
                block={TeacherBlock.A}
                onChange={updateBlock}
                isInvalid={validationList.A}
                defaultValue={teacherSettings.current.A}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 9 }]}
                block={TeacherBlock.B}
                onChange={updateBlock}
                isInvalid={validationList.B}
                defaultValue={teacherSettings.current.B}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 8 }]}
                block={TeacherBlock.C}
                onChange={updateBlock}
                isInvalid={validationList.C}
                defaultValue={teacherSettings.current.C}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 7 }]}
                block={TeacherBlock.D}
                onChange={updateBlock}
                isInvalid={validationList.D}
                defaultValue={teacherSettings.current.D}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 6 }]}
                block={TeacherBlock.E}
                onChange={updateBlock}
                isInvalid={validationList.E}
                defaultValue={teacherSettings.current.E}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 5 }]}
                block={TeacherBlock.F}
                onChange={updateBlock}
                isInvalid={validationList.F}
                defaultValue={teacherSettings.current.F}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 4 }]}
                block={TeacherBlock.G}
                onChange={updateBlock}
                isInvalid={validationList.G}
                defaultValue={teacherSettings.current.G}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 3 }]}
                block={TeacherBlock.ADVISORY}
                onChange={updateBlock}
                isInvalid={validationList.ADVISORY}
                defaultValue={teacherSettings.current.ADVISORY}
                scrollRef={scrollViewRef}
            />

            <Text style={styles.header}>Extra Teachers</Text>
            <Text style={styles.note}>
                Add extra teachers who you want to be notified for.
            </Text>
            {validationList.EXTRA ? (
                <ErrorCard style={[styles.validation]}>
                    Please make sure you've entered all your teachers correctly.
                </ErrorCard>
            ) : null}

            <ExtraTeachers
                style={[{ zIndex: 2 }]}
                onChange={(newSettings) => {
                    updateBlock(TeacherBlock.EXTRA, newSettings);
                }}
                defaultValue={teacherSettings.current.EXTRA}
                scrollRef={scrollViewRef}
            />

            <Divider />
            {validationList.existsInvalid ? (
                <ErrorCard style={[styles.validation]}>
                    Please check the info you entered and try again.
                </ErrorCard>
            ) : null}
            {saving ? (
                <LoadingCard style={[styles.validation]}>Saving...</LoadingCard>
            ) : null}
            {saveError ? (
                <ErrorCard style={[styles.validation]}>
                    There was a problem while saving your information. Please
                    try again.
                </ErrorCard>
            ) : null}
            <TextButton
                style={[{ zIndex: 1 }]}
                iconName="check-circle"
                onPress={() => {
                    if (validate()) {
                        setSaving(true);
                    }
                }}
                isFilled
            >
                Get Started
            </TextButton>
        </WithWaveHeader>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
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
        fontFamily: Theme.headerFont,
        fontSize: 30,
        marginBottom: 3,
    },
    classInput: {
        marginTop: 10,
        marginBottom: 20,
    },
    validation: {
        marginBottom: 20,
    },
});

export default ScheduleOnboarding;
