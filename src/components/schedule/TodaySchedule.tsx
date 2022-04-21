import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsenceItem } from '../../AbsenceCalculator';
import { Block, TeacherBlock } from '../../api/APITypes';
import { TimeRelation, useAppState } from '../../state/AppStateContext';
import Theme from '../../Theme';
import {
    TeacherBlockFullNames,
    ShortBlocks,
    DayBlockFullNames,
} from '../../Utils';
import BlockCard from './BlockCard';
import PassingTimeCard from './PassingTimeCard';

function TodaySchedule({ style }: { style?: any }) {
    const { value: appState } = useAppState();

    const body: React.ReactNode[] = [];

    if (
        appState.weekSchedule &&
        appState.dateToday &&
        appState.weekSchedule[appState.dateToday]
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
    }

    return <View>{body}</View>;
}

const styles = StyleSheet.create({
    container: {},
    blockCard: {
        marginBottom: 20,
    },
});

export default TodaySchedule;
