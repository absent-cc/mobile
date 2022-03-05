import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Divider from '../../components/Divider';
import TextField from '../../components/input/TextField';
import Dropdown from '../../components/input/Dropdown';
import TextButton from '../../components/button/TextButton';
import WaveHeader from '../../components/header/WaveHeader';
import WaveHeaderSafearea from '../../components/header/WaveHeaderSafearea';
import { useSettings } from '../../state/SettingsContext';
import {
    gradeIndexer,
    GradeList,
    schoolIndexer,
    SchoolList,
} from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import { useAPI } from '../../api/APIContext';

function ProfileOnboarding({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const api = useAPI();
    const settings = useSettings();

    const userSettings = React.useRef(settings.value.user);

    // validation
    const [validationList, setValidationList] = React.useState({
        existsInvalid: false,
        name: false,
        grade: false,
        school: false,
    });

    const validate = (): boolean => {
        const newValidationList = { ...validationList, existsInvalid: false };

        newValidationList.name = userSettings.current.name.length < 1;
        newValidationList.grade = gradeIndexer(userSettings.current.grade) < 0;
        newValidationList.school =
            schoolIndexer(userSettings.current.school) < 0;

        // summary
        newValidationList.existsInvalid =
            Object.values(newValidationList).includes(true);

        setValidationList(newValidationList);

        return !newValidationList.existsInvalid;
    };

    const save = (): boolean => {
        if (validate()) {
            settings.setSettings((oldSettings) => ({
                ...oldSettings,
                user: userSettings.current,
            }));
            return true;
        }
        return false;
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
                        api.logout();
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
                            userSettings.current.name = newValue;

                            // once it has already been validated once, redo on subsequent inputs
                            if (validationList.existsInvalid) validate();
                        }}
                        placeholder="e.g. Kevin McFakehead"
                        style={[styles.inputField, { zIndex: 4 }]}
                        defaultValue={userSettings.current.name}
                    />
                    {validationList.name ? (
                        <ErrorCard style={[styles.validation]}>
                            Please enter your name.
                        </ErrorCard>
                    ) : null}
                    <Dropdown
                        label="What grade are you in?"
                        onChange={(newValue: number) => {
                            userSettings.current.grade = GradeList[newValue];

                            // once it has already been validated once, redo on subsequent inputs
                            if (validationList.existsInvalid) validate();
                        }}
                        style={[styles.inputField, { zIndex: 3 }]}
                        placeholder="Select a grade"
                        options={['9', '10', '11', '12']}
                        defaultValue={gradeIndexer(userSettings.current.grade)}
                    />
                    {validationList.grade ? (
                        <ErrorCard style={[styles.validation]}>
                            Please select a grade.
                        </ErrorCard>
                    ) : null}
                    <Dropdown
                        label="Which school do you go to?"
                        onChange={(newValue: number) => {
                            userSettings.current.school = SchoolList[newValue];

                            // once it has already been validated once, redo on subsequent inputs
                            if (validationList.existsInvalid) validate();
                        }}
                        style={[styles.inputField, { zIndex: 2 }]}
                        placeholder="Select a school"
                        options={['South', 'North']}
                        defaultValue={schoolIndexer(
                            userSettings.current.school,
                        )}
                    />
                    {validationList.school ? (
                        <ErrorCard style={[styles.validation]}>
                            Please select a school.
                        </ErrorCard>
                    ) : null}

                    <Divider />
                    {validationList.existsInvalid ? (
                        <ErrorCard style={[styles.validation]}>
                            Please check the info you entered and try again.
                        </ErrorCard>
                    ) : null}
                    <TextButton
                        style={[{ zIndex: 1 }]}
                        iconName="chevron-right"
                        onPress={() => {
                            if (save()) {
                                navigation.navigate('ScheduleOnboarding');
                            }
                        }}
                        isFilled
                    >
                        Next
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
        paddingTop: 15,
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
        fontFamily: Theme.headerFont,
        fontSize: 30,
        marginBottom: 3,
    },
    inputField: {
        marginVertical: 5,
    },
    validation: {
        marginBottom: 20,
    },
});

export default ProfileOnboarding;
