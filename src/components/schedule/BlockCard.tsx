import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DayBlock, LunchType } from '../../api/APITypes';
import { toTimeString } from '../../DateWordUtils';
import { TimeRelation } from '../../state/AppStateContext';
import { useSettings } from '../../state/SettingsContext';
import Theme from '../../Theme';
import {
    ShortBlocks,
    DayBlockFullNames,
    LunchNames,
    isLongShortBlockName,
    isTeacherBlock,
    toTeacherBlockUnsafe,
} from '../../Utils';

function BlockCard({
    style,
    dayBlock,
    activeLunch,
    isActive = false,
    activeLunchRelation,
}: {
    style?: any;
    dayBlock: DayBlock;
    activeLunch: LunchType | null;
    isActive: boolean;
    activeLunchRelation: TimeRelation | null;
}) {
    const { value: settings } = useSettings();
    let teacherName = null;
    if (isTeacherBlock(dayBlock.block)) {
        teacherName = settings.schedule[
            toTeacherBlockUnsafe(dayBlock.block)
        ].reduce(
            (prev, curr) => `${prev}${prev.length > 0 ? '\n' : ''}${curr.name}`,
            '',
        );
    }

    return (
        <View
            style={[
                style,
                styles.container,
                isActive && styles.activeContainer,
            ]}
        >
            <View style={styles.row}>
                <View
                    style={[styles.blockBox, isActive && styles.activeBlockBox]}
                >
                    <Text
                        style={[
                            styles.block,
                            isLongShortBlockName(dayBlock.block) &&
                                styles.smallBlockName,
                            isActive && styles.activeBlock,
                        ]}
                        allowFontScaling={false}
                    >
                        {ShortBlocks[dayBlock.block]}
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.name, isActive && styles.activeName]}>
                        {DayBlockFullNames[dayBlock.block]}
                    </Text>
                    <Text style={[styles.time, isActive && styles.activeTime]}>
                        {toTimeString(dayBlock.startTime)}
                        {' - '}
                        {toTimeString(dayBlock.endTime)}
                    </Text>
                    {teacherName && (
                        <Text
                            style={[styles.note, isActive && styles.activeNote]}
                        >
                            {teacherName}
                        </Text>
                    )}
                </View>
            </View>
            {dayBlock.lunches && (
                <View style={[styles.row, styles.lunchRow]}>
                    {dayBlock.lunches.map((lunch, index) => (
                        <React.Fragment key={lunch.lunch}>
                            <View
                                style={[
                                    styles.lunchBox,
                                    isActive && styles.activeLunch,
                                    activeLunch === lunch.lunch &&
                                        activeLunchRelation ===
                                            TimeRelation.Current &&
                                        styles.currentLunch,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.lunchName,
                                        activeLunch === lunch.lunch &&
                                            activeLunchRelation ===
                                                TimeRelation.Current &&
                                            styles.activeLunchName,
                                    ]}
                                >
                                    {LunchNames[lunch.lunch]}
                                </Text>
                                <Text
                                    style={[
                                        styles.lunchTime,
                                        activeLunch === lunch.lunch &&
                                            activeLunchRelation ===
                                                TimeRelation.Current &&
                                            styles.activeLunchTime,
                                    ]}
                                >
                                    {toTimeString(lunch.startTime)}
                                    {' - '}
                                    {toTimeString(lunch.endTime)}
                                </Text>
                            </View>

                            {
                                // the ?? 0 is so typescript doesn't complain about it being null
                                index < (dayBlock.lunches?.length ?? 0) - 1 && (
                                    <View
                                        style={[
                                            styles.lunchDivider,
                                            activeLunch === lunch.lunch &&
                                                activeLunchRelation ===
                                                    TimeRelation.After &&
                                                styles.lunchDividerActive,
                                        ]}
                                    />
                                )
                            }
                        </React.Fragment>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        backgroundColor: Theme.lighterForeground,
        // padding: 20,
        overflow: 'hidden',
    },
    activeContainer: {
        backgroundColor: Theme.primaryColor,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    lunchRow: {
        backgroundColor: Theme.lighterForeground,
        alignItems: 'stretch',
    },

    blockBox: {
        // flex: 1,
        flexBasis: 'auto',
        flexShrink: 0,
        flexGrow: 0,
        // padding: 4,
        minWidth: 60,
        aspectRatio: 1,
        marginRight: 20,
        backgroundColor: Theme.lighterForeground,
        borderRadius: 20,

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeBlockBox: {
        backgroundColor: Theme.primaryColor,
    },
    content: {
        flexGrow: 4,
        flexShrink: 1,
    },
    block: {
        fontFamily: Theme.strongFont,
        color: Theme.darkForeground,
        fontSize: 50,
    },
    activeBlock: {
        color: Theme.foregroundAlternate,
    },
    smallBlockName: {
        fontSize: 25,
    },
    name: {
        fontFamily: Theme.strongFont,
        fontSize: 20,
        color: Theme.foregroundColor,
    },
    activeName: {
        color: Theme.foregroundAlternate,
    },
    time: {
        fontFamily: Theme.regularFont,
        color: Theme.darkForeground,
        marginTop: 0,
        fontSize: 20,
    },
    activeTime: {
        color: Theme.lighterForeground,
    },
    note: {
        fontFamily: Theme.regularFont,
        // marginTop: 10,
        fontSize: 20,
        color: Theme.darkForeground,
    },
    activeNote: {
        color: Theme.foregroundAlternate,
    },
    lunchBox: {
        backgroundColor: Theme.lightForeground,
        borderRadius: 20,
        padding: 16,
        flex: 1,
    },
    lunchName: {
        fontFamily: Theme.strongFont,
        fontSize: 20,
        color: Theme.darkForeground,
    },
    activeLunchName: {
        color: Theme.foregroundAlternate,
    },
    lunchTime: {
        fontFamily: Theme.regularFont,
        color: Theme.darkForeground,
        marginTop: 0,
        fontSize: 16,
    },
    activeLunchTime: {
        color: Theme.lighterForeground,
    },
    midLunch: {
        marginHorizontal: 10,
    },
    activeLunch: {},
    currentLunch: {
        backgroundColor: Theme.primaryColor,
    },
    lunchDivider: {
        width: 5,
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 20,
    },
    lunchDividerActive: {
        backgroundColor: Theme.primaryColor,
    },
});

export default BlockCard;
