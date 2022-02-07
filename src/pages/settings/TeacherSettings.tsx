import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import TextButton from '../../components/button/TextButton';
import ClassInput from '../../components/ClassInput';
import ExtraTeachers from '../../components/ExtraTeachers';
import HeaderSafearea from '../../components/header/HeaderSafearea';
import { Block } from '../../api/APITypes';
import { useSettings } from '../../state/SettingsContext';
import { useAPI } from '../../state/APIContext';
import { EmptyEditingSchedule } from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import Divider from '../../components/Divider';
import LoadingCard from '../../components/card/LoadingCard';

function TeacherSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const api = useAPI();
    const settings = useSettings();

    const defaultValue = { ...EmptyEditingSchedule };

    Object.keys(Block).forEach((block: string) => {
        const teachers = settings.value.schedule[block as Block];

        defaultValue[block as Block] = teachers.map((teacher) => teacher.name);
    });

    const teacherSettings = React.useRef(defaultValue);

    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

    // validation
    const [validationList, setValidationList] = React.useState({
        existsInvalid: false,
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
        f: false,
        g: false,
        adv: false,
        extra: false,
    });

    const validate = (): boolean => {
        const newValidationList = { ...validationList, existsInvalid: false };

        const invalidBlock = (block: Block): boolean => {
            return teacherSettings.current[block].includes('');
        };

        newValidationList.a = invalidBlock(Block.A);
        newValidationList.b = invalidBlock(Block.B);
        newValidationList.c = invalidBlock(Block.C);
        newValidationList.d = invalidBlock(Block.D);
        newValidationList.e = invalidBlock(Block.E);
        newValidationList.f = invalidBlock(Block.F);
        newValidationList.g = invalidBlock(Block.G);
        newValidationList.adv = invalidBlock(Block.ADV);
        newValidationList.extra = invalidBlock(Block.EXTRA);

        // summary
        newValidationList.existsInvalid =
            Object.values(newValidationList).includes(true);

        setValidationList(newValidationList);

        return !newValidationList.existsInvalid;
    };

    const updateBlock = (block: Block, newSettings: string[]) => {
        teacherSettings.current[block] = newSettings;
    };

    // reset screen on exit
    React.useEffect(() => {
        return () => {
            teacherSettings.current = defaultValue;
        };
    });

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
                        isInvalid={validationList.a}
                        defaultValue={teacherSettings.current.A}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 9 }]}
                        block={Block.B}
                        onChange={updateBlock}
                        isInvalid={validationList.b}
                        defaultValue={teacherSettings.current.B}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 8 }]}
                        block={Block.C}
                        onChange={updateBlock}
                        isInvalid={validationList.c}
                        defaultValue={teacherSettings.current.C}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 7 }]}
                        block={Block.D}
                        onChange={updateBlock}
                        isInvalid={validationList.d}
                        defaultValue={teacherSettings.current.D}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 6 }]}
                        block={Block.E}
                        onChange={updateBlock}
                        isInvalid={validationList.e}
                        defaultValue={teacherSettings.current.E}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 5 }]}
                        block={Block.F}
                        onChange={updateBlock}
                        isInvalid={validationList.f}
                        defaultValue={teacherSettings.current.F}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 4 }]}
                        block={Block.G}
                        onChange={updateBlock}
                        isInvalid={validationList.g}
                        defaultValue={teacherSettings.current.G}
                    />
                    <ClassInput
                        style={[styles.classInput, { zIndex: 3 }]}
                        block={Block.ADV}
                        onChange={updateBlock}
                        isInvalid={validationList.adv}
                        defaultValue={teacherSettings.current.ADV}
                    />

                    <Text style={styles.header}>Extra Teachers</Text>
                    <Text style={styles.note}>
                        Add extra teachers who you want to be notified for.
                    </Text>
                    {validationList.extra ? (
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
        fontFamily: Theme.strongFont,
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
