import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';
import Header from '../components/header/Header';
import Divider from '../components/Divider';
import TextButton from '../components/button/TextButton';
import RowButton from '../components/RowButton';
import Anchor from '../components/Anchor';
import HeaderSafearea from '../components/header/HeaderSafearea';

function Settings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.pageView}>
            <HeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
            >
                <Header
                    iconName="x"
                    iconClick={() => {
                        navigation.goBack();
                    }}
                    text="Settings"
                />
                <View style={styles.content}>
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
                    <TextButton
                        style={styles.inputField}
                        iconName="log-out"
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }],
                            });
                        }}
                        isFilled
                    >
                        Log out
                    </TextButton>
                    <Text style={styles.attribution}>
                        Thanks for using abSENT!{'\n\n'}
                        abSENT was created by{' '}
                        <Anchor
                            href="https://rkarim.xyz"
                            style={styles.attribution}
                        >
                            Roshan Karim
                        </Anchor>
                        ,{' '}
                        <Anchor
                            href="https://leah.vashevko.com"
                            style={styles.attribution}
                        >
                            Leah Vashevko
                        </Anchor>
                        , and{' '}
                        <Anchor
                            href="https://github.com/bykevinyang/"
                            style={styles.attribution}
                        >
                            Kevin Yang
                        </Anchor>
                        .
                    </Text>
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
        paddingBottom: 200,
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
        color: Theme.darkerForeground,
    },
});

export default Settings;
