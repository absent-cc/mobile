import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import TextButton from '../../components/button/TextButton';
import ClassInput from '../../components/ClassInput';
import ExtraTeachers from '../../components/ExtraTeachers';
import HeaderSafearea from '../../components/header/HeaderSafearea';
import { Block, Teacher } from '../../api/APITypes';
import { useSettings } from '../../state/SettingsContext';
import { EmptySchedule } from '../../Utils';

function TeacherSettings({ navigation }: { navigation: any }) {
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
                    text="Teachers"
                />
                <View style={styles.content}>
                    <Text style={styles.note}>
                        Tap on each block to edit up your classes.
                    </Text>

                    <ClassInput style={styles.classInput} blockId="a" />
                    <ClassInput style={styles.classInput} blockId="b" />
                    <ClassInput style={styles.classInput} blockId="c" />
                    <ClassInput style={styles.classInput} blockId="d" />
                    <ClassInput style={styles.classInput} blockId="e" />
                    <ClassInput style={styles.classInput} blockId="f" />
                    <ClassInput style={styles.classInput} blockId="g" />
                    <ClassInput style={styles.classInput} blockId="adv" />

                    <Text style={styles.header}>Extra Teachers</Text>
                    <Text style={styles.note}>
                        Extra teachers allows you to keep track of attendance
                        for other teachers at school.
                    </Text>

                    <ExtraTeachers style={styles.classInput} />
                    <TextButton
                        style={styles.inputField}
                        iconName="save"
                        onPress={() => {}}
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
        color: '#666',
    },
});

export default TeacherSettings;
