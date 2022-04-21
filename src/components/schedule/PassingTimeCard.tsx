import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsenceItem } from '../../AbsenceCalculator';
import { Block } from '../../api/APITypes';
import { toPrettyTime, toTimeString } from '../../DateWordUtils';
import Theme from '../../Theme';
import { TeacherBlockFullNames, ShortBlocks } from '../../Utils';

function PassingTimeCard({
    style,
    startTime,
    endTime,
}: {
    style?: any;
    startTime: number;
    endTime: number;
}) {
    return (
        <View style={[style, styles.container]}>
            <Text style={styles.text}>Passing Time</Text>
            <Text style={styles.time}>
                {toTimeString(startTime)} - {toTimeString(endTime)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        backgroundColor: Theme.primaryColor,
        overflow: 'hidden',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
        flex: 1,
    },
    time: {
        fontFamily: Theme.regularFont,
        color: Theme.lighterForeground,
        fontSize: 20,
        flex: 0,
        marginLeft: 10,
    },
});

export default PassingTimeCard;
