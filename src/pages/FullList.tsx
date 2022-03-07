import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    RefreshControl,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';
import WaveHeader from '../components/header/WaveHeader';
import WaveHeaderSafearea from '../components/header/WaveHeaderSafearea';
import { splitName } from '../Utils';
import { useAppState } from '../state/AppStateContext';
import AllTeacherCard from '../components/card/AllTeacherCard';

function FullList({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const { value: appState } = useAppState();

    const cards = appState.absences
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
        paddingTop: 0,
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
