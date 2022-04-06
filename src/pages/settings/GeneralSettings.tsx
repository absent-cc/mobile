import { StyleSheet, Text, Alert } from 'react-native';
import React from 'react';
import Theme from '../../Theme';
import TextField from '../../components/input/TextField';
import Dropdown from '../../components/input/Dropdown';
import TextButton from '../../components/button/TextButton';
import { useSettings } from '../../state/SettingsContext';
import {
    gradeIndexer,
    GradeList,
    schoolIndexer,
    SchoolList,
} from '../../Utils';
import ErrorCard from '../../components/card/ErrorCard';
import { useAPI } from '../../api/APIContext';
import Divider from '../../components/Divider';
import LoadingCard from '../../components/card/LoadingCard';
import WithHeader from '../../components/header/WithHeader';

function GeneralSettings({ navigation }: { navigation: any }) {
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

    const { navigate } = navigation;
    React.useEffect(() => {
        if (saving) {
            api.saveUserSettings(userSettings.current)
                .then(() => {
                    navigate('Settings');
                })
                .catch(() => {
                    setSaveError(true);
                });
        }
    }, [saving, api, navigate]);

    // reset screen on exit
    // React.useEffect(() => {
    //     return () => {
    //         userSettings.current = defaultValue;
    //     };
    // });

    const deleteAccount = () => {
        Alert.alert(
            'Are you sure?',
            'Are you sure you want to delete your account? This action is irreversible.',
            [
                {
                    text: 'Delete',
                    onPress: () => {
                        api.deleteAccount();
                        api.logout();
                    },
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
        );
    };

    return (
        <WithHeader
            style={styles.pageView}
            iconName="chevron-left"
            iconClick={() => {
                navigation.goBack();
            }}
            isLeft
            text="Account Settings"
        >
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
                defaultValue={schoolIndexer(userSettings.current.school)}
            />
            {validationList.school ? (
                <ErrorCard style={[styles.validation]}>
                    Please select a school.
                </ErrorCard>
            ) : null}

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

            <Divider />
            <Text style={styles.header}>Delete Your Account</Text>
            <Text style={styles.note}>
                Delete your account. We'll clear your data from our servers.
            </Text>
            <TextButton
                style={[{ zIndex: 0 }, styles.delete]}
                iconName="user-x"
                onPress={deleteAccount}
                isFilled
            >
                Delete Account
            </TextButton>
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
        marginBottom: 16,
    },
    inputField: {
        marginTop: 10,
    },
    save: {
        marginTop: 40,
    },
    validation: {
        marginVertical: 20,
    },
    header: {
        color: Theme.foregroundColor,
        fontFamily: Theme.headerFont,
        fontSize: 30,
        marginBottom: 10,
    },
    delete: {
        marginTop: 20,
    },
});

export default GeneralSettings;
