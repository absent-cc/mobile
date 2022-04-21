import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Block } from '../../api/APITypes';
import {
    sortTimeStrings,
    timeBetweenTimeStrings,
    toPrettyTime,
    toTimeString,
} from '../../DateWordUtils';
import { useAppState } from '../../state/AppStateContext';
import Theme from '../../Theme';
import { ShortBlocks } from '../../Utils';

function FullWeek({ style }: { style?: any }) {
    const { value: appState } = useAppState();

    const [tooSmall, setTooSmall] = React.useState<Record<string, number>>({});
    const [minuteRatio, setMinuteRatio] = React.useState(1);
    const [isLoading, setLoading] = React.useState(false);
    const minDiffToPx = (minDiff: number) => minDiff * minuteRatio;

    // const firstStartTime = sortTimeStrings(
    //     Object.entries(SampleSched).map(([, blocks]) => {
    //         return blocks[0].startTime;
    //     }),
    //     true,
    // )[0];

    const firstStartTime =
        Object.entries(appState.weekSchedule)
            // get start times
            .map(([, daySchedule]) => {
                return daySchedule.schedule[0].startTime;
            })
            // remove zeroes (broken times)
            .filter((el) => el !== 0)
            // sort ascending and get first
            .sort((a, b) => a - b)[0] ?? 0;

    // const lastEndTime = sortTimeStrings(
    //     Object.entries(SampleSched).map(([, blocks]) => {
    //         return blocks[blocks.length - 1].endTime;
    //     }),
    //     false,
    // )[0];

    const lastEndTime =
        Object.entries(appState.weekSchedule)
            // get start times
            .map(([, daySchedule]) => {
                return daySchedule.schedule[daySchedule.schedule.length - 1]
                    .endTime;
            })
            // remove zeroes (broken times)
            .filter((el) => el !== 0)
            // sort descending and get first
            .sort((a, b) => b - a)[0] ?? 0;

    const body = Object.entries(appState.weekSchedule).map(
        ([day, daySchedule]) => {
            let lastBlockEndTime = firstStartTime;

            let dayBody = daySchedule.schedule.map((block, blockIndex) => {
                // unique key to identify the block to store which ones are too small
                const blockKey = `${day}-${block.block}`;

                const minDiff = block.endTime - block.startTime;
                const height = minDiffToPx(minDiff);
                const topMargin = minDiffToPx(
                    block.startTime - lastBlockEndTime,
                );

                lastBlockEndTime = block.endTime;

                return (
                    <React.Fragment key={block.block}>
                        {block.startTime !== firstStartTime && (
                            <View
                                style={[
                                    styles.blockDivider,
                                    {
                                        height: topMargin,
                                        // borderTopWidth:
                                        //     blockIndex === 0 ? 0 : 2,
                                    },
                                ]}
                            />
                        )}
                        <View
                            style={[
                                styles.block,
                                {
                                    minHeight: height,
                                },
                            ]}
                            // makes the minute ratio be the largest it should be
                            onLayout={(event: any) => {
                                const { height: realHeight } =
                                    event.nativeEvent.layout;

                                // react native's measurements seem to be a little funky
                                // so there's a little 2 pixel tolerance
                                // for some reason, real height reads 120.5 while height is 120.25
                                if (realHeight > height + 2) {
                                    if (tooSmall[blockKey] === 2) {
                                        // make everything bigger if we have to
                                        console.log(
                                            blockKey,
                                            'had problem with',
                                            realHeight,
                                            height,
                                        );
                                        // setMinuteRatio(realHeight / minDiff);
                                        setTimeout(() => {
                                            setMinuteRatio(
                                                realHeight / minDiff,
                                            );
                                        }, 3000);
                                    } else if (tooSmall[blockKey] === 1) {
                                        // try removing times
                                        setTimeout(() => {
                                            setTooSmall((newTooSmall) => ({
                                                ...newTooSmall,
                                                [blockKey]: 2,
                                            }));
                                        }, 3000);
                                    } else {
                                        // try making it small
                                        setTimeout(() => {
                                            setTooSmall((newTooSmall) => ({
                                                ...newTooSmall,
                                                [blockKey]: 1,
                                            }));
                                        }, 3000);
                                    }
                                }
                            }}
                        >
                            <View style={styles.blockContent}>
                                <Text
                                    style={[
                                        styles.blockText,
                                        tooSmall[blockKey] > 0 &&
                                            styles.smallBlockText,
                                    ]}
                                >
                                    {ShortBlocks[block.block]}
                                </Text>
                                {!(tooSmall[blockKey] === 2) && (
                                    <Text
                                        style={[
                                            styles.time,
                                            tooSmall[blockKey] > 0 &&
                                                styles.smallTime,
                                        ]}
                                    >
                                        {toTimeString(block.startTime)}
                                        {' - '}
                                        {toTimeString(block.endTime)}
                                    </Text>
                                )}
                                {/* {block.lunches && block.lunches?.length > 0 && (
                                    <Text style={styles.lunchLink}>Lunch</Text>
                                )} */}
                            </View>
                        </View>

                        {
                            // if it's the last block
                            blockIndex === daySchedule.schedule.length - 1 && (
                                <View
                                    style={[
                                        styles.blockFlexDivider,
                                        {
                                            borderBottomWidth:
                                                block.endTime === lastEndTime
                                                    ? 0
                                                    : 2,
                                        },
                                    ]}
                                    key={`divideafter-${block.block}`}
                                />
                            )
                        }
                    </React.Fragment>
                );
            });

            if (dayBody.length === 0) {
                dayBody = [
                    <Text style={[styles.block]} key="noschool">
                        No school.
                    </Text>,
                ];
            }

            return (
                <React.Fragment key={day}>
                    <View style={[styles.day]}>{dayBody}</View>
                    <View style={[styles.dayDivider, { height: '100%' }]} />
                </React.Fragment>
            );
        },
    );

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 150);
    });

    return (
        <>
            <View style={[style, styles.container]}>{body}</View>
            {isLoading && (
                <View style={styles.loading}>
                    <ActivityIndicator
                        size="large"
                        color={Theme.primaryColor}
                    />
                </View>
            )}
        </>
    );
}

const blockLineColor = Theme.primaryColor;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.lighterForeground,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 2,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderColor: blockLineColor,
    },
    day: {
        borderColor: blockLineColor,
        flex: 1,
    },
    dayDivider: {
        width: 2,
        flex: 0,
        backgroundColor: blockLineColor,
    },
    blockDivider: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: blockLineColor,
    },
    blockFlexDivider: {
        borderTopWidth: 2,
        borderColor: blockLineColor,
        flex: 1,
    },
    block: {
        width: '100%',
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.backgroundColor,
    },
    blockContent: {
        padding: 5,
    },
    blockText: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundColor,
        fontSize: 20,
    },
    smallBlockText: {
        fontSize: 16,
    },
    time: {
        fontFamily: Theme.regularFont,
        fontSize: 16,
        color: Theme.darkForeground,
        marginTop: 0,
    },
    smallTime: {
        fontSize: 13,
    },
    lunchLink: {
        fontFamily: Theme.regularFont,
        fontSize: 16,
        color: Theme.primaryColor,
        textDecorationLine: 'underline',
        marginTop: 5,
    },
    loading: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: Theme.backgroundColor,
        paddingTop: 50,
    },
});

export default FullWeek;
