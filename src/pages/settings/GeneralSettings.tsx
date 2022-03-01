import { StyleSheet, Text, ScrollView, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import TextField from '../../components/input/TextField';
import Dropdown from '../../components/input/Dropdown';
import TextButton from '../../components/button/TextButton';
import HeaderSafearea from '../../components/header/HeaderSafearea';
import { useSettings } from '../../state/SettingsContext';
import {
    gradeIndexer,
    GradeList,
    schoolIndexer,
    SchoolList,
} from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import { useAPI } from '../../state/APIContext';
import Divider from '../../components/Divider';
import LoadingCard from '../../components/card/LoadingCard';

function GeneralSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    const api = useAPI();
    const settings = useSettings();

    // TODO: change this to be a deep copy someday for safety
    const defaultValue = { ...settings.value.user };
    const userSettings = React.useRef(defaultValue);

    const [saving, setSaving] = React.useState(false);
    const [saveError, setSaveError] = React.useState(false);

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

    React.useEffect(() => {
        if (saving) {
            api.saveUserSettings(userSettings.current)
                .then(() => {
                    navigation.navigate('Settings');
                })
                .catch(() => {
                    setSaveError(true);
                });
        }
    }, [saving, api, settings, navigation]);

    // reset screen on exit
    React.useEffect(() => {
        return () => {
            userSettings.current = defaultValue;
        };
    });

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
                    text="General Settings"
                />
                <View style={styles.content}>
                    <Text style={styles.note}>Edit your account details.</Text>
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
                        style={[{ zIndex: 1 }, styles.save]}
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
    inputField: {
        marginTop: 10,
    },
    save: {
        marginTop: 20,
    },
    validation: {
        marginBottom: 20,
    },
});

export default GeneralSettings;
