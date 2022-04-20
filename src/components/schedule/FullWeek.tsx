import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Block } from '../../api/APITypes';
import {
    sortTimeStrings,
    timeBetweenTimeStrings,
    toPrettyTime,
} from '../../DateWordUtils';
import Theme from '../../Theme';
import { ShortBlocks } from '../../Utils';

const Today = '2022-04-05';
const SampleSched = {
    '2022-04-04': [
        {
            block: Block.A,
            startTime: '09:00:00',
            endTime: '10:05:00',
        },
        {
            block: Block.ADVISORY,
            startTime: '10:10:00',
            endTime: '10:30:00',
        },
        {
            block: Block.B,
            startTime: '10:35:00',
            endTime: '11:40:00',
            lunches: [
                {
                    lunch: 'L1',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                },
            ],
        },
    ],
    '2022-04-05': [
        {
            block: Block.A,
            startTime: '09:00:00',
            endTime: '10:05:00',
        },
        {
            block: Block.ADVISORY,
            startTime: '10:10:00',
            endTime: '10:30:00',
        },
    ],
    '2022-04-06': [
        {
            block: Block.A,
            startTime: '09:00:00',
            endTime: '10:05:00',
        },
        {
            block: Block.ADVISORY,
            startTime: '10:10:00',
            endTime: '10:30:00',
        },
        {
            block: Block.B,
            startTime: '10:35:00',
            endTime: '11:40:00',
        },
    ],
    '2022-04-07': [
        {
            block: Block.A,
            startTime: '09:00:00',
            endTime: '10:05:00',
        },
        {
            block: Block.B,
            startTime: '10:10:00',
            endTime: '11:40:00',
            lunches: [
                {
                    lunch: 'L1',
                    startTime: '10:00:00',
                    endTime: '11:00:00',
                },
            ],
        },
    ],
    '2022-04-08': [
        {
            block: Block.A,
            startTime: '09:00:00',
            endTime: '10:05:00',
        },
        {
            block: Block.ADVISORY,
            startTime: '10:10:00',
            endTime: '10:30:00',
        },
        {
            block: Block.B,
            startTime: '10:35:00',
            endTime: '11:40:00',
        },
    ],
};

function FullWeek({ style }: { style?: any }) {
    const [tooSmall, setTooSmall] = React.useState<Record<string, boolean>>({});
    const [minuteRatio, setMinuteRatio] = React.useState(1.5);
    const [isLoading, setLoading] = React.useState(true);
    const minDiffToPx = (minDiff: number) => minDiff * minuteRatio;

    const firstStartTime = sortTimeStrings(
        Object.entries(SampleSched).map(([, blocks]) => {
            return blocks[0].startTime;
        }),
        true,
    )[0];

    const lastEndTime = sortTimeStrings(
        Object.entries(SampleSched).map(([, blocks]) => {
            return blocks[blocks.length - 1].endTime;
        }),
        false,
    )[0];

    const body = Object.entries(SampleSched).map(([day, blocks]) => {
        let lastBlockEndTime = firstStartTime;

        let dayBody = blocks.map((block, blockIndex) => {
            // unique key to identify the block to store which ones are too small
            const blockKey = `${day}-${block.block}`;

            const minDiff =
                timeBetweenTimeStrings(block.startTime, block.endTime) || 0;
            const height = minDiffToPx(minDiff);
            const topMargin = minDiffToPx(
                timeBetweenTimeStrings(lastBlockEndTime, block.startTime) || 0,
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
                                    borderTopWidth: blockIndex === 0 ? 0 : 2,
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
                                if (tooSmall[blockKey]) {
                                    setMinuteRatio(realHeight / minDiff);
                                } else {
                                    setTooSmall((newTooSmall) => ({
                                        ...newTooSmall,
                                        [blockKey]: true,
                                    }));
                                }
                            }
                        }}
                    >
                        <View style={styles.blockContent}>
                            <Text style={styles.blockText}>
                                {ShortBlocks[block.block]}
                            </Text>
                            {!tooSmall[blockKey] && (
                                <Text style={styles.time}>
                                    {toPrettyTime(block.startTime)} -{' '}
                                    {toPrettyTime(block.endTime)}
                                </Text>
                            )}
                            {block.lunches && block.lunches?.length > 0 && (
                                <Text style={styles.lunchLink}>Lunch</Text>
                            )}
                        </View>
                    </View>
                    {blockIndex === blocks.length - 1 && (
                        <View
                            style={[
                                styles.blockFlexDivider,
                                {
                                    borderBottomWidth:
                                        block.endTime === lastEndTime ? 0 : 2,
                                },
                            ]}
                            key={`divideafter-${block.block}`}
                        />
                    )}
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
    });

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

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.lightForeground,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 2,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderColor: Theme.darkForeground,
    },
    day: {
        borderColor: Theme.darkForeground,
        flex: 1,
    },
    dayDivider: {
        width: 2,
        flex: 0,
        backgroundColor: Theme.darkForeground,
    },
    blockDivider: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Theme.darkForeground,
    },
    blockFlexDivider: {
        borderTopWidth: 2,
        borderColor: Theme.darkForeground,
        flex: 1,
    },
    block: {
        width: '100%',
        borderColor: Theme.darkForeground,
        backgroundColor: Theme.backgroundColor,
    },
    blockContent: {
        padding: 5,
    },
    blockText: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundColor,
        fontSize: 22,
    },
    time: {
        fontFamily: Theme.regularFont,
        fontSize: 16,
        color: Theme.darkForeground,
        marginTop: 0,
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
