import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { toTimeString } from '../../DateWordUtils';
import { useTheme } from '../../theme/ThemeContext';

function PassingTimeCard({
    style,
    startTime,
    endTime,
}: {
    style?: any;
    startTime: number;
    endTime: number;
}) {
    const { Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
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
                    fontFamily: Theme.italicFont,
                    color: Theme.lighterForeground,
                    fontSize: 20,
                    flex: 0,
                    marginLeft: 10,
                },
            }),
        [Theme],
    );

    return (
        <View style={[style, styles.container]}>
            <Text style={styles.text}>Passing Time</Text>
            <Text style={styles.time}>
                {toTimeString(startTime)} - {toTimeString(endTime)}
            </Text>
        </View>
    );
}

export default PassingTimeCard;
