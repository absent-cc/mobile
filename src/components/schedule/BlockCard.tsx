import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsenceItem } from '../../AbsenceCalculator';
import { Block, TeacherBlock } from '../../api/APITypes';
import Theme from '../../Theme';
import {
    TeacherBlockFullNames,
    ShortBlocks,
    DayBlockFullNames,
} from '../../Utils';

function BlockCard({
    style,
    isLunch = false,
    activeLunch,
    isActive = false,
    block,
}: {
    style?: any;
    isLunch?: boolean;
    activeLunch?: number;
    isActive?: boolean;
    block: Block;
}) {
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
                        style={[styles.block, isActive && styles.activeBlock]}
                    >
                        {ShortBlocks[block]}
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.name, isActive && styles.activeName]}>
                        {DayBlockFullNames[block]}
                    </Text>
                    <Text style={[styles.time, isActive && styles.activeTime]}>
                        9:00 - 10:15
                    </Text>
                    <Text style={[styles.note, isActive && styles.activeNote]}>
                        Ryan Normandin
                    </Text>
                </View>
            </View>
            {isLunch && (
                <View style={[styles.row, styles.lunchRow]}>
                    <View
                        style={[
                            styles.lunchBox,
                            isActive && styles.activeLunch,
                            activeLunch === 0 && styles.currentLunch,
                        ]}
                    >
                        <Text
                            style={[
                                styles.lunchName,
                                activeLunch === 0 && styles.activeLunchName,
                            ]}
                        >
                            1st
                        </Text>
                        <Text
                            style={[
                                styles.lunchTime,
                                activeLunch === 0 && styles.activeLunchTime,
                            ]}
                        >
                            9:00 - 10:15
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.lunchBox,
                            styles.midLunch,
                            isActive && styles.activeLunch,
                            activeLunch === 1 && styles.currentLunch,
                        ]}
                    >
                        <Text
                            style={[
                                styles.lunchName,
                                activeLunch === 1 && styles.activeLunchName,
                            ]}
                        >
                            2nd
                        </Text>
                        <Text
                            style={[
                                styles.lunchTime,
                                activeLunch === 1 && styles.activeLunchTime,
                            ]}
                        >
                            9:00 - 10:15
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.lunchBox,
                            isActive && styles.activeLunch,
                            activeLunch === 2 && styles.currentLunch,
                        ]}
                    >
                        <Text
                            style={[
                                styles.lunchName,
                                activeLunch === 2 && styles.activeLunchName,
                            ]}
                        >
                            3rd
                        </Text>
                        <Text
                            style={[
                                styles.lunchTime,
                                activeLunch === 2 && styles.activeLunchTime,
                            ]}
                        >
                            9:00 - 10:15
                        </Text>
                    </View>
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
        // width: 70,
        // height: 70,
        flex: 1,
        padding: 4,
        aspectRatio: 1,
        marginRight: 20,
        backgroundColor: Theme.lighterForeground,
        // backgroundColor: Theme.darkForeground,
        borderRadius: 20,

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        // borderWidth: 2,
        // borderColor: Theme.primaryColor,
    },
    activeBlockBox: {
        backgroundColor: Theme.primaryColor,
        // borderColor: Theme.foregroundAlternate,
    },
    content: {
        flex: 4,
    },
    block: {
        fontFamily: Theme.strongFont,
        color: Theme.darkForeground,
        fontSize: 50,
    },
    activeBlock: {
        color: Theme.foregroundAlternate,
    },
    adv: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundAlternate,
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
        color: Theme.foregroundColor,
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
    activeLunch: {
        // backgroundColor: Theme.primaryColor,
    },
    currentLunch: {
        // borderWidth: 2,
        // borderColor: Theme.foregroundAlternate,
        // borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
    },
});

export default BlockCard;
