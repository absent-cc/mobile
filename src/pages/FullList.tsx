import { StyleSheet, Text } from 'react-native';
import React from 'react';
import Theme from '../Theme';
import { splitName } from '../Utils';
import { useAppState } from '../state/AppStateContext';
import AllTeacherCard from '../components/card/AllTeacherCard';
import WithWaveHeader from '../components/header/WithWaveHeader';

function FullList() {
    const { value: appState } = useAppState();
    let cards;

    if (appState.dayBlocksToday && appState.dayBlocksToday.length > 0) {
        cards = appState.absences
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
    } else {
        cards = (
            <Text style={styles.status}>
                No school today! Enjoy your day! 🎉
            </Text>
        );
    }

    return (
        <WithWaveHeader style={styles.pageView} text="All Absences" reversed>
            {cards}
        </WithWaveHeader>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
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
