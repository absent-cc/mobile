import { StyleSheet, ScrollView, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';
import WaveHeader from '../components/header/WaveHeader';
import WaveHeaderSafearea from '../components/header/WaveHeaderSafearea';
import { splitName } from '../Utils';
import { useAppState } from '../state/AppStateContext';
import AllTeacherCard from '../components/card/AllTeacherCard';
import { SchoolName } from '../api/APITypes';

function FullList({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const { value: appState } = useAppState();

    const cards = [
        {
            teacher: {
                tid: 'y',
                name: 'Katherine Osorio',
                school: SchoolName.NSHS,
            },
            time: 'All Day',
            note: 'C, F, G cancelled. No track practice after school.',
        },
        {
            teacher: {
                tid: 'y',
                name: 'Steven Orlo',
                school: SchoolName.NSHS,
            },
            time: 'All Day',
            note: 'All classes cancelled.',
        },
        {
            teacher: {
                tid: 'y',
                name: 'Mark Williams',
                school: SchoolName.NSHS,
            },
            time: 'Partial Day PM',
            note: 'G cancelled',
        },
        {
            teacher: {
                tid: 'y',
                name: 'Samuel Thomas',
                school: SchoolName.NSHS,
            },
            time: 'All Day',
            note: 'All classes cancelled today. Check Schoology.',
        },
        {
            teacher: {
                tid: 'y',
                name: 'Millie Roam',
                school: SchoolName.NSHS,
            },
            time: 'Partia Day AM',
            note: 'Check schoology for more info.',
        },
        {
            teacher: {
                tid: 'y',
                name: 'Donna Hamilton',
                school: SchoolName.NSHS,
            },
            time: 'Partia Day PM',
            note: 'Classes cancelled',
        },
    ]
        ?.sort(
            // sort alphabetically
            (a, b) =>
                splitName(a.teacher.name)[1].localeCompare(
                    splitName(b.teacher.name)[1],
                ),
        )
        .map((absence) => {
            return (
                <AllTeacherCard
                    teacher={absence}
                    key={absence.teacher.tid}
                    style={styles.card}
                />
            );
        });

    return (
        <View style={styles.pageView}>
            <WaveHeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
            >
                <WaveHeader
                    iconName="chevron-left"
                    iconClick={() => {
                        navigation.goBack();
                    }}
                    isLeft
                    text="All Absences"
                />
                <View style={styles.content}>{cards}</View>
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
        paddingBottom: 80,
    },
    hello: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    date: {
        fontFamily: Theme.strongFont,
    },
    count: {
        fontFamily: Theme.strongFont,
    },
    status: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    card: {
        marginBottom: 20,
    },
    header: {
        color: Theme.foregroundColor,
        fontFamily: Theme.headerFont,
        fontSize: 30,
    },
});

export default FullList;
