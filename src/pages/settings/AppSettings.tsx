import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import React from 'react';
import TeacherCard from '../../components/card/TeacherCard';
import Divider from '../../components/Divider';
import TextField from '../../components/input/TextField';
import Dropdown from '../../components/input/Dropdown';
import TextButton from '../../components/button/TextButton';
import ClassInput from '../../components/ClassInput';
import ExtraTeachers from '../../components/ExtraTeachers';
import SwitchField from '../../components/input/Switch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderSafearea from '../../components/header/HeaderSafearea';

function AppSettings({ navigation }: { navigation: any }) {
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
                    text={'App Options'}
                />
                <View style={styles.content}>
                    <SwitchField
                        style={styles.inputField}
                        label="Show free blocks as absent teachers"
                        onChange={() => {}}
                    />
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

export default AppSettings;
