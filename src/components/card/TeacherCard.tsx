import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsentTeacher, Block } from '../../api/APITypes';
import Theme from '../../Theme';
import { ShortBlocks } from '../../Utils';

function TeacherCard({
    block,
    style,
    isFree = false,
    teacher,
}: {
    block: Block;
    isFree?: boolean;
    teacher?: AbsentTeacher;
    style?: any;
}) {
    let boxContent;

    if (block === Block.ADV) {
        boxContent = <Text style={styles.adv}>{ShortBlocks[Block.ADV]}</Text>;
    } else if (block === Block.EXTRA) {
        boxContent = <Feather name="plus" style={styles.icon} size={40} />;
    } else {
        boxContent = <Text style={styles.block}>{ShortBlocks[block]}</Text>;
    }

    return (
        <View style={[style, styles.container]}>
            <View style={styles.blockBox}>{boxContent}</View>
            <View style={styles.content}>
                {isFree || !teacher ? (
                    <>
                        <Text style={[styles.free]}>Free!</Text>
                        <Text style={[styles.freeNote]}>
                            Enjoy your free block!
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={[styles.name]}>{teacher.name}</Text>
                        <Text style={[styles.time]}>{teacher.time}</Text>
                        <Text style={[styles.note]}>{teacher.notes}</Text>
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
