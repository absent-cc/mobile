import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsentTeacher } from '../../api/APITypes';
import Theme from '../../Theme';
import Divider from '../Divider';

function AllTeacherCard({
    style,
    teacher,
    last,
}: {
    teacher: AbsentTeacher;
    style?: any;
    last: boolean;
}) {
    // reverse it so last name comes first, and if there's only one name, use it as last
    const splitTeacherName = teacher.teacher.reversedSplitName;

    return (
        <View style={[style, styles.container]}>
            <View style={[styles.topRow]}>
                <Text style={[styles.name]}>
                    {splitTeacherName[0].toUpperCase()}, {splitTeacherName[1]}
                </Text>
                {teacher.time && teacher.time.trim().length > 0 ? (
                    <Text style={[styles.time]}>{teacher.time.trim()}</Text>
                ) : null}
            </View>

            {teacher.note && teacher.note.trim().length > 0 ? (
                <Text style={[styles.note]}>{teacher.note.trim()}</Text>
            ) : null}

            {!last && <Divider style={styles.divider} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // borderRadius: 20,
        // backgroundColor: Theme.lighterForeground,
        // overflow: 'hidden',
        // padding: 20,
    },
    even: {
        // backgroundColor: Theme.lightForeground,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontFamily: Theme.strongFont,
        fontSize: 20,
        flexShrink: 1,
    },
    time: {
        fontFamily: Theme.italicFont,
        color: Theme.darkForeground,
        marginTop: 0,
        fontSize: 20,
    },
    note: {
        fontFamily: Theme.regularFont,
        marginTop: 10,
        fontSize: 20,
    },
    divider: {
        marginVertical: 25,
    },
});

export default AllTeacherCard;
