import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import TextButton from '../../components/button/TextButton';
import ClassInput from '../../components/ClassInput';
import ExtraTeachers from '../../components/ExtraTeachers';
import HeaderSafearea from '../../components/header/HeaderSafearea';
import { Block, EditingSchedule } from '../../api/APITypes';
import { useSettings } from '../../state/SettingsContext';
import { useAPI } from '../../api/APIContext';
import { BlockIterator } from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import Divider from '../../components/Divider';
import LoadingCard from '../../components/card/LoadingCard';

function TeacherSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const api = useAPI();
    const settings = useSettings();

    const teacherSettings = React.useRef(
        Object.fromEntries(
            BlockIterator.map((block) => {
                const teachers = settings.value.schedule[block];

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

    const invalidBlock = (block: Block): boolean => {
        return teacherSettings.current[block].includes('');
    };

    const validate = (): boolean => {
        const newValidationList = { ...validationList, existsInvalid: false };

        newValidationList.A = invalidBlock(Block.A);
        newValidationList.B = invalidBlock(Block.B);
        newValidationList.C = invalidBlock(Block.C);
        newValidationList.D = invalidBlock(Block.D);
        newValidationList.E = invalidBlock(Block.E);
        newValidationList.F = invalidBlock(Block.F);
        newValidationList.G = invalidBlock(Block.G);
        newValidationList.ADVISORY = invalidBlock(Block.ADVISORY);
        newValidationList.EXTRA = invalidBlock(Block.EXTRA);

        // summary
        newValidationList.existsInvalid =
            Object.values(newValidationList).includes(true);

        setValidationList(newValidationList);

        return !newValidationList.existsInvalid;
    };

    const updateBlock = (block: Block, newSettings: string[]) => {
        teacherSettings.current[block] = newSettings;

        // when the error gets fixed, the error goes away
        if (validationList[block] && !invalidBlock(block)) {
            const newValidationList = { ...validationList };
            newValidationList[block] = false;
            setValidationList(newValidationList);
        }
    };

    // reset screen on exit
    // React.useEffect(() => {
    //     return () => {
    //         teacherSettings.current = defaultValue;
    //     };
    // });

    // save stuff to server
    React.useEffect(() => {
        if (saving) {
            api.saveSchedule(teacherSettings.current)
                .then(() => {
                    navigation.navigate('Settings');
                })
                .catch(() => {
                    setSaveError(true);
                });
        }
    }, [saving, api, settings, navigation]);

    return (
        <View style={styles.pageView}>
            <HeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
                keyboardShouldPersistTaps="handled"
            >
                <Header
                    iconName="chevron-left"
                    iconClick={() => {
                        navigation.goBack();
                    }}
                    isLeft
                    text="Teachers"
                />
                <View style={styles.content}>
                    <Text style={styles.note}>
                        Tap on each block to edit up your classes.
                    </Text>

                    <ClassInput
                        style={[styles.classInput, { zIndex: 10 }]}
                        block={Block.A}
                        onChange={updateBlock}
                        isInvalid={validationList.A}
                        defaultValue={teacherSettings.current.A}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 9 }]}
                        block={Block.B}
                        onChange={updateBlock}
                        isInvalid={validationList.B}
                        defaultValue={teacherSettings.current.B}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 8 }]}
                        block={Block.C}
                        onChange={updateBlock}
                        isInvalid={validationList.C}
                        defaultValue={teacherSettings.current.C}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 7 }]}
                        block={Block.D}
                        onChange={updateBlock}
                        isInvalid={validationList.D}
                        defaultValue={teacherSettings.current.D}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 6 }]}
                        block={Block.E}
                        onChange={updateBlock}
                        isInvalid={validationList.E}
                        defaultValue={teacherSettings.current.E}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 5 }]}
                        block={Block.F}
                        onChange={updateBlock}
                        isInvalid={validationList.F}
                        defaultValue={teacherSettings.current.F}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 4 }]}
                        block={Block.G}
                        onChange={updateBlock}
                        isInvalid={validationList.G}
                        defaultValue={teacherSettings.current.G}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 3 }]}
                        block={Block.ADVISORY}
                        onChange={updateBlock}
                        isInvalid={validationList.ADVISORY}
                        defaultValue={teacherSettings.current.ADVISORY}
                    />

                    <Text style={styles.header}>Extra Teachers</Text>
                    <Text style={styles.note}>
                        Add extra teachers who you want to be notified for.
                    </Text>
                    {validationList.EXTRA ? (
                        <ErrorCard style={[styles.validation]}>
                            Please make sure you've entered all your teachers
                            correctly.
                        </ErrorCard>
                    ) : null}

                    <ExtraTeachers
                        style={[{ zIndex: 2 }]}
                        onChange={(newSettings) => {
                            updateBlock(Block.EXTRA, newSettings);
                        }}
                        defaultValue={teacherSettings.current.EXTRA}
                    />

                    <Divider />
                    {validationList.existsInvalid ? (
                        <ErrorCard style={[styles.validation]}>
                            Please check the info you entered and try again.
                        </ErrorCard>
                    ) : null}
                    {saving ? (
                        <LoadingCard style={[styles.validation]}>
                            Saving...
                        </LoadingCard>
                    ) : null}
                    {saveError ? (
                        <ErrorCard style={[styles.validation]}>
                            There was a problem while saving your information.
                            Please try again.
                        </ErrorCard>
                    ) : null}
                    <TextButton
                        style={[{ zIndex: 1 }]}
                        iconName="save"
                        onPress={() => {
                            if (validate()) {
                                setSaving(true);
                            }
                        }}
                        isFilled
                    >
                        Save
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
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
    classInput: {
        marginBottom: 30,
    },
    validation: {
        marginBottom: 20,
    },
});

export default TeacherSettings;
