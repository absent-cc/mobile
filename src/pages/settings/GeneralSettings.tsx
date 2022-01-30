import { StyleSheet, Text, ScrollView, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import TextField from '../../components/input/TextField';
import Dropdown from '../../components/input/Dropdown';
import TextButton from '../../components/button/TextButton';
import HeaderSafearea from '../../components/header/HeaderSafearea';

function GeneralSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

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
                    text="General Settings"
                />
                <View style={styles.content}>
                    <Text style={styles.note}>Edit your account details.</Text>
                    <TextField
                        label="What's your name?"
                        onChange={() => {
                            // TODO
                        }}
                        placeholder="e.g. Kevin McFakehead"
                        style={styles.inputField}
                    />
                    <TextField
                        label="What grade are you in?"
                        onChange={() => {
                            // TODO
                        }}
                        placeholder="e.g. 10"
                        style={styles.inputField}
                        isNumber
                    />
                    <Dropdown
                        label="Which school do you go to?"
                        onChange={() => {
                            // TODO
                        }}
                        style={[styles.inputField, styles.dropdown]}
                        placeholder="Select a school"
                        options={['South', 'North']}
                        defaultValue={-1}
                    />
                    <TextButton
                        style={[styles.inputField, styles.save]}
                        iconName="save"
                        onPress={() => {
                            // TODO
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
        paddingBottom: 200,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 16,
        marginBottom: 16,
    },
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
    dropdown: {
        zIndex: 7,
    },
    save: {
        marginTop: 20,
    },
});

export default GeneralSettings;
