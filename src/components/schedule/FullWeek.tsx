import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Block } from '../../api/APITypes';
import { timeBetweenTimeStrings } from '../../DateWordUtils';
import Theme from '../../Theme';
import { ShortBlocks } from '../../Utils';

const Today = '2022-04-05';
const SampleSched = {
    '2022-04-04': [
        {
            block: Block.A,
            startTime: '9:00',
            endTime: '10:15',
        },
        {
            block: Block.B,
            startTime: '10:20',
            endTime: '11:00',
        },
    ],
    '2022-04-05': [
        {
            block: Block.A,
            startTime: '9:00',
            endTime: '10:15',
        },
    ],
    '2022-04-06': [
        {
            block: Block.A,
            startTime: '9:00',
            endTime: '10:15',
        },
    ],
    '2022-04-07': [
        {
            block: Block.A,
            startTime: '9:00',
            endTime: '10:15',
        },
    ],
    '2022-04-08': [
        {
            block: Block.A,
            startTime: '9:00',
            endTime: '10:15',
        },
    ],
};

function FullWeek({ style }: { style?: any }) {
    const minDiffToPx = (minDiff: number) => minDiff * 1.5;

    const body = Object.entries(SampleSched).map(([day, blocks], index) => {
        let startTime = '9:00';
        let endTime = '3:45';

        let lastBlockTime = '9:00';

        let dayBody = blocks.map((block, blockIndex) => {
            const minDiff = timeBetweenTimeStrings(
                block.startTime,
                block.endTime,
            );
            const topMargin =
                blockIndex === 0
                    ? 0
                    : minDiffToPx(
                          timeBetweenTimeStrings(startTime, block.startTime) ||
                              0,
                      );

            if (blockIndex === 0) {
                startTime = block.startTime;
            }

            if (blockIndex === blocks.length - 1) {
                endTime = block.endTime;
            }

            lastBlockTime = block.endTime;

            return (
                <View
                    style={[
                        styles.block,
                        {
                            top: topMargin,
                            height: minDiffToPx(Math.max(minDiff || 50, 50)),
                        },
                    ]}
                    key={block.block}
                >
                    <Text style={styles.blockText}>
                        {ShortBlocks[block.block]}
                    </Text>
                </View>
            );
        });

        if (dayBody.length === 0) {
            dayBody = [
                <Text style={[styles.block]} key="noschool">
                    No school.
                </Text>,
            ];
        }

        const dividerHeight = minDiffToPx(
            timeBetweenTimeStrings(startTime, endTime) || 0,
        );

        return (
            <>
                {index === 0 && (
                    <View
                        style={[styles.dayDivider, { height: dividerHeight }]}
                        key={`${day}-predivide`}
                    />
                )}
                <View style={[styles.day]} key={day}>
                    {dayBody}
                </View>
                <View
                    style={[styles.dayDivider, { height: dividerHeight }]}
                    key={`${day}-postdivide`}
                />
            </>
        );
    });

    return (
        <View style={[style, styles.container]}>
            {body}
            {/* <View style={styles.dayDivider} />
            <View style={[styles.day]}>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>A</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>Adv</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>B</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>C</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>D</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>E</Text>
                </View>
            </View>
            <View style={styles.dayDivider} />
            <View style={[styles.day]}>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>A</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>B</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>F</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>G</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>Lion</Text>
                </View>
            </View>
            <View style={styles.dayDivider} />
            <View style={[styles.day]}>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>C</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>WIN</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>D</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>E</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>F</Text>
                </View>
            </View>
            <View style={styles.dayDivider} />
            <View style={[styles.day]}>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>A</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>B</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>G</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>E</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>WIN</Text>
                </View>
            </View>
            <View style={styles.dayDivider} />
            <View style={[styles.day]}>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>C</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>WIN</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>D</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>F</Text>
                </View>
                <View style={[styles.block]}>
                    <Text style={styles.blockText}>G</Text>
                </View>
            </View>
            <View style={styles.dayDivider} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // borderRadius: 20,
        // backgroundColor: Theme.lighterForeground,
        // padding: 20,
        // overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    day: {
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
        // borderTopWidth: 1,
        borderColor: Theme.darkForeground,
        flex: 1,
    },
    dayDivider: {
        width: 2,
        flex: 0,
        backgroundColor: Theme.darkForeground,
    },
    block: {
        width: '100%',
        position: 'absolute',
        height: 80,
        padding: 5,
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Theme.darkForeground,
        // marginBottom: 10,
    },
    blockText: {
        fontFamily: Theme.strongFont,
        fontSize: 20,
    },
});

export default FullWeek;
