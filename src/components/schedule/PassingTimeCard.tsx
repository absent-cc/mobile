import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsenceItem } from '../../AbsenceCalculator';
import { Block } from '../../api/APITypes';
import { toPrettyTime } from '../../DateWordUtils';
import Theme from '../../Theme';
import { BlockMapping, ShortBlocks } from '../../Utils';

function PassingTimeCard({
    style,
    startTime,
    endTime,
}: {
    style?: any;
    startTime: string;
    endTime: string;
}) {
    return (
        <View style={[style, styles.container]}>
            <Text style={styles.text}>Passing Time</Text>
            <Text style={styles.time}>
                {toPrettyTime(startTime)} - {toPrettyTime(endTime)}
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
    },
});

export default PassingTimeCard;
