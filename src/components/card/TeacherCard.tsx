import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsenceItem } from '../../AbsenceCalculator';
import { AbsentTeacher, Block } from '../../api/APITypes';
import Theme from '../../Theme';
import { ShortBlocks } from '../../Utils';

function TeacherCard({
    style,
    absenceItem,
}: {
    absenceItem: AbsenceItem;
    style?: any;
}) {
    let boxContent;

    if (absenceItem.block === Block.ADVISORY) {
        boxContent = (
            <Text style={styles.adv}>{ShortBlocks[Block.ADVISORY]}</Text>
        );
    } else if (absenceItem.block === Block.EXTRA) {
        boxContent = <Feather name="plus" style={styles.icon} size={40} />;
    } else {
        boxContent = (
            <Text style={styles.block}>{ShortBlocks[absenceItem.block]}</Text>
        );
    }

    return (
        <View style={[style, styles.container]}>
            <View style={styles.blockBox}>{boxContent}</View>
            <View style={styles.content}>
                {absenceItem.isFree || !absenceItem.teacher ? (
                    <>
                        <Text style={[styles.free]}>Free!</Text>
                        <Text style={[styles.freeNote]}>
                            Enjoy your free block!
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={[styles.name]}>
                            {absenceItem.teacher.teacher.name}
                        </Text>
                        {absenceItem.teacher.time &&
                        absenceItem.teacher.time.trim().length > 0 ? (
                            <Text style={[styles.time]}>
                                {absenceItem.teacher.time.trim()}
                            </Text>
                        ) : null}
                        {absenceItem.teacher.note &&
                        absenceItem.teacher.note.trim().length > 0 ? (
                            <Text style={[styles.note]}>
                                {absenceItem.teacher.note.trim()}
                            </Text>
                        ) : null}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blockBox: {
        width: 70,
        height: 70,
        marginRight: 20,
        backgroundColor: Theme.primaryColor,
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    block: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundAlternate,
        fontSize: 50,
    },
    adv: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundAlternate,
        fontSize: 25,
    },
    icon: {
        color: Theme.foregroundAlternate,
    },
    name: {
        fontFamily: Theme.strongFont,
        fontSize: 20,
    },
    time: {
        fontFamily: Theme.regularFont,
        color: Theme.darkForeground,
        marginTop: 0,
        fontSize: 20,
    },
    note: {
        fontFamily: Theme.regularFont,
        // marginTop: 10,
        fontSize: 20,
    },
    free: {
        fontFamily: Theme.strongFont,
        fontSize: 20,
    },
    freeNote: {
        color: Theme.darkForeground,
        fontFamily: Theme.regularFont,
        marginTop: 0,
        fontSize: 20,
    },
});

export default TeacherCard;
