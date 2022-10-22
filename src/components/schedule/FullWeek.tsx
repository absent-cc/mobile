import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    Dimensions,
    Pressable,
} from 'react-native';
import { toTimeString } from '../../DateWordUtils';
import { TimeRelation, useAppState } from '../../state/AppStateContext';
import { useTheme } from '../../theme/ThemeContext';
import { LunchNums, ShortBlocks } from '../../Utils';
import Anchor from '../Anchor';
import { useDialog } from '../dialog/Dialog';
import BlockDialog from './BlockDialog';

function FullWeek({ style }: { style?: any }) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(() => {
        const blockLineColor = Theme.darkForeground;

        return StyleSheet.create({
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
                overflow: 'hidden',
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
            activeDivider: {
                backgroundColor: Theme.primaryColor,
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
            blockPressed: {
                backgroundColor: Theme.lighterForeground,
            },
            blockPressedActive: {
                backgroundColor: Theme.darkerPrimary,
            },
            selectedBlock: {
                backgroundColor: Theme.lightForeground,
            },
            selectedBlockActive: {
                backgroundColor: Theme.darkerPrimary,
            },
            activeBlock: {
                backgroundColor: Theme.primaryColor,
            },
            blockContent: {
                padding: 5,
            },
            blockText: {
                fontFamily: Theme.strongFont,
                color: Theme.foregroundColor,
                fontSize: 20,
            },
            activeBlockText: {
                color: Theme.foregroundAlternate,
            },
            smallBlockText: {
                fontSize: 16,
            },
            time: {
                fontFamily: Theme.italicFont,
                fontSize: 16,
                color: Theme.darkForeground,
                marginTop: 0,
            },
            activeTime: {
                color: Theme.lighterForeground,
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
                flex: 1,
                borderBottomWidth: 2,
                borderColor: blockLineColor,
                padding: 5,
            },
            noSchool: {
                fontFamily: Theme.regularFont,
                fontSize: 16,
                color: Theme.foregroundColor,
            },
            fullTimeIndicator: {
                position: 'absolute',
                width: '100%',
                right: 0,
                height: 2,
                backgroundColor: Theme.darkForeground,
                opacity: 0.3,
            },
            timeIndicator: {
                position: 'absolute',
                width: '100%',
                right: 0,
                height: 2,
                backgroundColor: Theme.foregroundAlternate,
                opacity: 0.8,
            },
            timeIndicatorCircle: {
                position: 'absolute',
                width: 10,
                height: 10,
                right: -5,
                backgroundColor: Theme.foregroundAlternate,
                opacity: 1,
                borderRadius: 5,
            },
            lunchIndicator: {
                position: 'absolute',
                width: '100%',
                right: 0,
                backgroundColor: Theme.darkForeground,
                opacity: 0.1,
            },
            lunchIndicatorActive: {
                backgroundColor: Theme.foregroundAlternate,
                opacity: 0.1,
            },
            lunchIndicatorText: {
                fontFamily: Theme.regularFont,
                fontSize: 10,
                color: Theme.darkForeground,
                position: 'absolute',
                right: 3,
            },
            lunchIndicatorActiveText: {
                color: Theme.lighterForeground,
            },
            nshsSitePlug: {
                marginTop: 10,
                fontFamily: Theme.regularFont,
                color: Theme.darkForeground,
                fontSize: 16,
                textAlign: 'center',
            },
        });
    }, [Theme]);

    const { value: appState, setAppState } = useAppState();
    const { open: openDialog, close: closeDialog } = useDialog();

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

    // REMEMBER PREVIOUS CALCULATIONS
    const usePreviousNumbers = appState.fullWeekMinuteRatio > 0;

    const tooSmall = React.useRef<Record<string, number>>(
        usePreviousNumbers ? appState.fullWeekTooSmall : {},
    );
    // the ideal ratio is about 0.7 of the screen
    const [minuteRatio, setMinuteRatio] = React.useState(
        usePreviousNumbers
            ? appState.fullWeekMinuteRatio
            : (0.7 * windowHeight) / (lastEndTime - firstStartTime),
    );

    const [isLoading, setLoading] = React.useState(!usePreviousNumbers);
    // const [isLoading, setLoading] = React.useState(false);
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const renderTimeout = React.useRef<NodeJS.Timeout | null>(null);
    const finishedLoadingCb = React.useMemo(
        () => () => {
            console.log('done loading');
            setLoading(false);
            // propogate up calculations when done
            setAppState((oldState) => ({
                ...oldState,
                fullWeekMinuteRatio: minuteRatio,
                fullWeekTooSmall: tooSmall.current,
            }));
        },
        [minuteRatio, setAppState],
    );
    const loadingTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const rerenderSchedule = React.useMemo(
        () => () => {
            forceUpdate();
            if (loadingTimeout.current) {
                clearTimeout(loadingTimeout.current);
            }
            console.log('loading - rerender');
            loadingTimeout.current = setTimeout(finishedLoadingCb, 150);
        },
        [finishedLoadingCb],
    );

    React.useEffect(rerenderSchedule, []);

    const minDiffToPx = (minDiff: number) => minDiff * minuteRatio;

    const [selectedBlock, setSelectedBlock] = React.useState<string | null>(
        null,
    );

    // close selected block when navigating away
    const navigation = useNavigation();
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setSelectedBlock(null);
        });

        return unsubscribe;
    }, [navigation]);

    const body = Object.entries(appState.weekSchedule).map(
        ([day, daySchedule]) => {
            const isTodayActive = day === appState.dateToday;

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

                const isBlockActive =
                    isTodayActive &&
                    appState.current.block === block.block &&
                    appState.current.blockRelation === TimeRelation.Current;

                const shouldPrevDividerBeActive =
                    isTodayActive &&
                    blockIndex > 0 &&
                    appState.current.block ===
                        daySchedule.schedule[blockIndex - 1].block &&
                    appState.current.blockRelation === TimeRelation.After;

                const closeBlockDialog = () => {
                    setSelectedBlock(null);
                    closeDialog();
                };
                const openBlockDialog = () => {
                    // close block info if you tap it twice
                    if (selectedBlock !== blockKey) {
                        openDialog(
                            <BlockDialog
                                close={closeBlockDialog}
                                dayBlock={block}
                                isActive={isBlockActive}
                            />,
                        );
                        setSelectedBlock(blockKey);
                    } else {
                        closeBlockDialog();
                    }
                };

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
                                    shouldPrevDividerBeActive &&
                                        styles.activeDivider,
                                ]}
                            />
                        )}
                        <Pressable
                            style={({ pressed }) => [
                                styles.block,
                                {
                                    minHeight: height,
                                },
                                isBlockActive && styles.activeBlock,
                                pressed && styles.blockPressed,
                                pressed &&
                                    isBlockActive &&
                                    styles.blockPressedActive,
                                selectedBlock === blockKey &&
                                    styles.selectedBlock,
                                selectedBlock === blockKey &&
                                    isBlockActive &&
                                    styles.selectedBlockActive,
                            ]}
                            // makes the minute ratio be the largest it should be
                            onLayout={(event: any) => {
                                const { height: realHeight } =
                                    event.nativeEvent.layout;

                                console.log(
                                    'in onlayout',
                                    blockKey,
                                    height,
                                    realHeight,
                                );
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
                                    console.log('scheduling');
                                    renderTimeout.current = setTimeout(
                                        rerenderSchedule,
                                        5,
                                    );
                                }
                            }}
                            onPress={openBlockDialog}
                        >
                            {block.lunches &&
                                block.lunches.map((lunch) => {
                                    const lunchStartHeight = minDiffToPx(
                                        lunch.startTime - block.startTime,
                                    );
                                    const lunchEndHeight = minDiffToPx(
                                        lunch.endTime - block.startTime,
                                    );

                                    return (
                                        <React.Fragment key={lunch.lunch}>
                                            <View
                                                style={[
                                                    styles.lunchIndicator,
                                                    isBlockActive &&
                                                        styles.lunchIndicatorActive,
                                                    {
                                                        top: lunchStartHeight,
                                                        height:
                                                            lunchEndHeight -
                                                            lunchStartHeight,
                                                    },
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    styles.lunchIndicatorText,
                                                    isBlockActive &&
                                                        styles.lunchIndicatorActiveText,
                                                    {
                                                        top:
                                                            lunchStartHeight +
                                                            3,
                                                    },
                                                ]}
                                            >
                                                {LunchNums[lunch.lunch]}
                                            </Text>
                                        </React.Fragment>
                                    );
                                })}
                            <View style={styles.blockContent}>
                                <Text
                                    style={[
                                        styles.blockText,
                                        isBlockActive && styles.activeBlockText,
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
                                            isBlockActive && styles.activeTime,
                                            tooSmall.current[blockKey] > 0 &&
                                                styles.smallTime,
                                        ]}
                                    >
                                        {toTimeString(block.startTime)}
                                        {' - '}
                                        {toTimeString(block.endTime)}
                                    </Text>
                                )}
                            </View>
                        </Pressable>

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

            const currentTime =
                appState.lastUpdateTime.getHours() * 60 +
                appState.lastUpdateTime.getMinutes();
            if (dayBody.length === 0) {
                dayBody = [
                    <View style={[styles.noSchoolContainer]} key="noschool">
                        <Text style={[styles.noSchool]}>No school.</Text>
                    </View>,
                ];
            } else if (isTodayActive && currentTime < lastBlockEndTime) {
                dayBody.push(
                    <View
                        style={[
                            styles.timeIndicator,
                            {
                                top: minDiffToPx(currentTime - firstStartTime),
                            },
                        ]}
                        key="timeindicator"
                    />,
                );
                dayBody.push(
                    <View
                        style={[
                            styles.timeIndicatorCircle,
                            {
                                top:
                                    minDiffToPx(currentTime - firstStartTime) -
                                    4,
                            },
                        ]}
                        key="timeindicator-circle"
                    />,
                );
            } else {
                dayBody.push(
                    <View
                        style={[
                            styles.fullTimeIndicator,
                            {
                                top: minDiffToPx(currentTime - firstStartTime),
                            },
                        ]}
                        key="timeindicator"
                    />,
                );
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
            <Text style={[styles.nshsSitePlug]}>
                Want a print schedule? Check out{' '}
                <Anchor href="https://nshs.site">nshs.site</Anchor>.
            </Text>
        </>
    );
}

export default FullWeek;
