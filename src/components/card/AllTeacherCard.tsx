import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsentTeacher } from '../../api/APITypes';
import Theme from '../../Theme';

function AllTeacherCard({
    style,
    teacher,
}: {
    teacher: AbsentTeacher;
    style?: any;
}) {
    return (
        <View style={[style, styles.container]}>
            <Text style={[styles.name]}>{teacher.teacher.name.trim()}</Text>
            {teacher.time && teacher.time.trim().length > 0 ? (
                <Text style={[styles.time]}>{teacher.time.trim()}</Text>
            ) : null}
            {teacher.note && teacher.note.trim().length > 0 ? (
                <Text style={[styles.note]}>{teacher.note.trim()}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
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
});

export default AllTeacherCard;
