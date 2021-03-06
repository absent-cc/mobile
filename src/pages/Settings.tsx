import React from 'react';
import { StyleSheet, Text, Linking } from 'react-native';
import Theme from '../Theme';
import Divider from '../components/Divider';
import TextButton from '../components/button/TextButton';
import RowButton from '../components/RowButton';
import Anchor from '../components/Anchor';
import { useAPI } from '../api/APIContext';
import WithHeader from '../components/header/WithHeader';

function Settings({ navigation }: { navigation: any }) {
    const api = useAPI();

    return (
        <WithHeader
            style={styles.pageView}
            iconName="x"
            iconClick={() => {
                navigation.goBack();
            }}
            text="Settings"
        >
            <RowButton
                onPress={() => {
                    navigation.navigate('GeneralSettings');
                }}
                label="Account Settings"
            />
            <RowButton
                onPress={() => {
                    navigation.navigate('TeacherSettings');
                }}
                label="Edit your teachers"
            />

            <RowButton
                onPress={() => {
                    navigation.navigate('AppSettings');
                }}
                label="App Options"
            />
            <Divider />

            <RowButton
                onPress={() => {
                    Linking.openURL('https://absent.cc/terms');
                }}
                label="Terms and Privacy Policy"
            />

            <RowButton
                onPress={() => {
                    Linking.openURL('mailto:hello@absent.cc');
                }}
                label="Contact Us"
            />
            <Divider />

            <TextButton
                style={styles.inputField}
                iconName="log-out"
                onPress={() => {
                    api.logout();
                }}
                isFilled
            >
                Log out
            </TextButton>
            <Text style={styles.attribution}>
                Thanks for using abSENT!{'\n\n'}
                Created by{'\n'}
                <Anchor href="https://rkarim.xyz" style={styles.attribution}>
                    Roshan
                </Anchor>
                ,{' '}
                <Anchor
                    href="https://leah.vashevko.com"
                    style={styles.attribution}
                >
                    Leah
                </Anchor>
                , and{' '}
                <Anchor
                    href="https://github.com/bykevinyang/"
                    style={styles.attribution}
                >
                    Kevin
                </Anchor>
                .
            </Text>
        </WithHeader>
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
        fontFamily: Theme.strongFont,
        fontSize: 30,
        marginBottom: 3,
    },
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
    dropdown: {
        zIndex: 7,
    },
    classInput: {
        marginBottom: 30,
    },
    attribution: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: Theme.regularFont,
        marginTop: 50,
        color: Theme.darkForeground,
    },
});

export default Settings;
