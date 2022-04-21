import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { toTimeString } from '../../DateWordUtils';
import { useAppState } from '../../state/AppStateContext';
import Theme from '../../Theme';
import { ShortBlocks } from '../../Utils';

function FullWeek({ style }: { style?: any }) {
    const { value: appState } = useAppState();

    const windowHeight = Dimensions.get('window').height;

    const firstStartTime =
        Object.entries(appState.weekSchedule)
            // get start times
            .map(([, daySchedule]) => {
                return daySchedule.schedule[0]?.startTime ?? 0;
            })
            // remove zeroes (broken times)
            .filter((el) => el !== 0)
            // sort ascending and get first
            .sort((a, b) => a - b)[0] ?? 0;

    const lastEndTime =
        Object.entries(appState.weekSchedule)
            // get start times
            .map(([, daySchedule]) => {
                return (
                    daySchedule.schedule[daySchedule.schedule.length - 1]
                        ?.endTime ?? 0
                );
            })
            // remove zeroes (broken times)
            .filter((el) => el !== 0)
            // sort descending and get first
            .sort((a, b) => b - a)[0] ?? 0;

    // const [tooSmall, setTooSmall] = React.useState<Record<string, number>>({});
    const tooSmall = React.useRef<Record<string, number>>({});
    // the ideal ratio is about 0.7 of the screen
    const [minuteRatio, setMinuteRatio] = React.useState(
        (0.7 * windowHeight) / (lastEndTime - firstStartTime),
    );
    // const [minuteRatio, setMinuteRatio] = React.useState(1);
    const [isLoading, setLoading] = React.useState(true);
    const minDiffToPx = (minDiff: number) => minDiff * minuteRatio;

    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const renderTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const loadingTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const rerenderSchedule = () => {
        forceUpdate();
        if (loadingTimeout.current) {
            clearTimeout(loadingTimeout.current);
        }
        loadingTimeout.current = setTimeout(() => setLoading(false), 50);
    };

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
                                    if (tooSmall.current[blockKey] === 2) {
                                        // make everything bigger if we have to
                                        setMinuteRatio(realHeight / minDiff);
                                        tooSmall.current = {};
                                    } else if (
                                        tooSmall.current[blockKey] === 1
                                    ) {
                                        // try removing times
                                        tooSmall.current[blockKey] = 2;
                                    } else {
                                        // try making it small
                                        tooSmall.current[blockKey] = 1;
                                    }

                                    // once all the updates are done, rerender with the new values
                                    if (renderTimeout.current) {
                                        clearTimeout(renderTimeout.current);
                                    }
                                    renderTimeout.current = setTimeout(
                                        rerenderSchedule,
                                        5,
                                    );
                                }
                            }}
                        >
                            <View style={styles.blockContent}>
                                <Text
                                    style={[
                                        styles.blockText,
                                        tooSmall.current[blockKey] > 0 &&
                                            styles.smallBlockText,
                                    ]}
                                >
                                    {ShortBlocks[block.block]}
                                </Text>
                                {!(tooSmall.current[blockKey] === 2) && (
                                    <Text
                                        style={[
                                            styles.time,
                                            tooSmall.current[blockKey] > 0 &&
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
                    <View style={[styles.noSchoolContainer]} key="noschool">
                        <Text style={[styles.noSchool]}>No school.</Text>
                    </View>,
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
    noSchoolContainer: {
        height: '100%',
        borderBottomWidth: 2,
        borderColor: blockLineColor,
        padding: 5,
    },
    noSchool: {
        fontFamily: Theme.regularFont,
        fontSize: 16,
    },
});

export default FullWeek;
