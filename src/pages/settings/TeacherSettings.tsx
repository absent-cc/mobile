import React from 'react';
import { StyleSheet, Text, ScrollView, Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import TextButton from '../../components/button/TextButton';
import ClassInput from '../../components/ClassInput';
import ExtraTeachers from '../../components/ExtraTeachers';
import { Block, EditingSchedule } from '../../api/APITypes';
import { useSettings } from '../../state/SettingsContext';
import { useAPI } from '../../api/APIContext';
import { BlockIterator } from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import LoadingCard from '../../components/card/LoadingCard';
import WithHeader from '../../components/header/WithHeader';

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
        const currentSettings = teacherSettings.current[block];
        if (
            !currentSettings.every((val, index) => val === newSettings[index])
        ) {
            hasUnsavedChanges.current = true;
        }

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
    const { navigate } = navigation;
    React.useEffect(() => {
        if (saving) {
            api.saveSchedule(teacherSettings.current)
                .then(() => {
                    hasUnsavedChanges.current = false;
                    navigate('Settings');
                })
                .catch(() => {
                    setSaveError(true);
                });
        }
    }, [saving, api, navigate]);

    // scroll to text inputs
    const scrollViewRef = React.useRef<ScrollView | null>(null);

    // prevent leaving without saving
    const hasUnsavedChanges = React.useRef(false);
    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e: any) => {
                if (!hasUnsavedChanges.current) {
                    return;
                }

                // Prevent leaving screen
                e.preventDefault();

                Alert.alert(
                    'Unsaved changes',
                    'You have unsaved changes. Are you sure you want to discard them?',
                    [
                        {
                            text: 'Stay',
                            style: 'cancel',
                            onPress: () => undefined,
                        },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ],
                );
            }),
        [navigation],
    );

    return (
        <WithHeader
            style={styles.pageView}
            iconName="chevron-left"
            iconClick={() => {
                navigation.goBack();
            }}
            isLeft
            text="Teachers"
            ref={scrollViewRef}
            footer={
                <View
                    style={[
                        styles.savePanel,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                >
                    {validationList.existsInvalid ? (
                        <ErrorCard style={[styles.saveValidation]}>
                            Please check the info you entered and try again.
                        </ErrorCard>
                    ) : null}
                    {saving ? (
                        <LoadingCard style={[styles.saveValidation]}>
                            Saving...
                        </LoadingCard>
                    ) : null}
                    {saveError ? (
                        <ErrorCard style={[styles.saveValidation]}>
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
            }
        >
            <Text style={styles.note}>
                Tap on each block to edit up your classes.
            </Text>

            <ClassInput
                style={[styles.classInput, { zIndex: 10 }]}
                block={Block.A}
                onChange={updateBlock}
                isInvalid={validationList.A}
                defaultValue={teacherSettings.current.A}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 9 }]}
                block={Block.B}
                onChange={updateBlock}
                isInvalid={validationList.B}
                defaultValue={teacherSettings.current.B}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 8 }]}
                block={Block.C}
                onChange={updateBlock}
                isInvalid={validationList.C}
                defaultValue={teacherSettings.current.C}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 7 }]}
                block={Block.D}
                onChange={updateBlock}
                isInvalid={validationList.D}
                defaultValue={teacherSettings.current.D}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 6 }]}
                block={Block.E}
                onChange={updateBlock}
                isInvalid={validationList.E}
                defaultValue={teacherSettings.current.E}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 5 }]}
                block={Block.F}
                onChange={updateBlock}
                isInvalid={validationList.F}
                defaultValue={teacherSettings.current.F}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 4 }]}
                block={Block.G}
                onChange={updateBlock}
                isInvalid={validationList.G}
                defaultValue={teacherSettings.current.G}
                scrollRef={scrollViewRef}
            />
            <ClassInput
                style={[styles.classInput, { zIndex: 3 }]}
                block={Block.ADVISORY}
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
                    updateBlock(Block.EXTRA, newSettings);
                }}
                defaultValue={teacherSettings.current.EXTRA}
                scrollRef={scrollViewRef}
            />
        </WithHeader>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 18,
        marginBottom: 20,
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
        marginVertical: 20,
    },
    saveValidation: {
        marginBottom: 20,
    },
    savePanel: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
        padding: 20,
        borderTopWidth: 2,
        borderColor: Theme.lightForeground,
    },
});

export default TeacherSettings;
