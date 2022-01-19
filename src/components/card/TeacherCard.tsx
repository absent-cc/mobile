import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Theme from '../../Theme';
import { BlockMapping } from '../../Utils';

function TeacherCard({
    name,
    blockId,
    time,
    note,
    style,
}: {
    name: string;
    blockId: string;
    time: string;
    note: string;
    style?: any;
}) {
    return (
        <View style={[style, styles.container]}>
            <Text style={[styles.text, styles.block]}>
                {BlockMapping[blockId]}
            </Text>
            <Text style={[styles.text, styles.name]}>{name}</Text>
            <Text style={[styles.text, styles.time]}>{time}</Text>
            <Text style={[styles.text, styles.note]}>{note}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Theme.primaryColor,
        padding: 20,
        backgroundColor: Theme.teacherBg,
    },
    text: {
        fontFamily: Theme.regularFont,
        fontSize: 20,
        color: Theme.foregroundColor,
    },
    block: {
        fontFamily: Theme.strongFont,
    },
    name: {
        position: 'absolute',
        left: 120,
        top: 20,
        right: 20,
    },
    time: {
        marginTop: 30,
    },
    note: { marginTop: 5 },
});

export default TeacherCard;
