import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TimeRelation, useAppState } from '../../state/AppStateContext';
import { useTheme } from '../../theme/ThemeContext';
import BlockCard from './BlockCard';
import PassingTimeCard from './PassingTimeCard';

function TodaySchedule(/* { style }: { style?: any } */) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {},
                blockCard: {
                    marginBottom: 20,
                },
                status: {
                    // marginTop: 10,
                    color: Theme.foregroundColor,
                    fontFamily: Theme.regularFont,
                    fontSize: 20,
                },
            }),
        [Theme],
    );

    const { value: appState } = useAppState();

    let body: React.ReactNode[] = [];

    if (
        appState.weekSchedule &&
        appState.dateToday &&
        appState.weekSchedule[appState.dateToday] &&
        appState.weekSchedule[appState.dateToday].schedule.length > 0
    ) {
        const todaySchedule =
            appState.weekSchedule[appState.dateToday].schedule;
        todaySchedule.forEach((dayBlock, index) => {
            body.push(
                <BlockCard
                    style={styles.blockCard}
                    dayBlock={dayBlock}
                    isActive={
                        appState.current.block === dayBlock.block &&
                        appState.current.blockRelation === TimeRelation.Current
                    }
                    activeLunch={appState.current.lunch}
                    activeLunchRelation={appState.current.lunchRelation}
                    key={dayBlock.block}
                />,
            );
            if (
                appState.current.block === dayBlock.block &&
                appState.current.blockRelation === TimeRelation.After &&
                // this never should happen, but just to make sure
                index < todaySchedule.length - 1
            ) {
                body.push(
                    <PassingTimeCard
                        style={styles.blockCard}
                        key="passingtime"
                        startTime={dayBlock.endTime}
                        endTime={todaySchedule[index + 1].startTime}
                    />,
                );
            }
        });
    } else {
        body = (
            <Text style={styles.status}>
                No school today! Enjoy your day! 🎉
            </Text>
        );
    }

    return <View>{body}</View>;
}

export default TodaySchedule;
