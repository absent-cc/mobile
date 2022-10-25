import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsentTeacher } from '../../api/APITypes';
import { BlockNameRegex } from '../../DateWordUtils';
import { useTheme } from '../../theme/ThemeContext';
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
    const { Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
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
                    fontFamily: Theme.regularFont,
                    color: Theme.foregroundColor,
                    fontSize: 20,
                    flexShrink: 1,
                },
                nameBold: {
                    fontFamily: Theme.strongFont,
                },
                time: {
                    fontFamily: Theme.italicFont,
                    color: Theme.darkForeground,
                    marginTop: 0,
                    fontSize: 20,
                },
                note: {
                    fontFamily: Theme.regularFont,
                    color: Theme.foregroundColor,
                    marginTop: 10,
                    fontSize: 20,
                },
                noteHighlight: {
                    textDecorationLine: 'underline',
                    textDecorationColor: Theme.primaryColor,
                    textDecorationStyle: 'solid',
                },
                divider: {
                    marginVertical: 25,
                },
            }),
        [Theme],
    );

    // reverse it so last name comes first, and if there's only one name, use it as last
    const splitTeacherName = teacher.teacher.reversedSplitName;

    const notes = [];

    if (teacher.note && teacher.note.trim().length > 0) {
        let index = 0;
        let noteText = teacher.note.trim();
        let match = noteText.match(BlockNameRegex);
        while (match !== null) {
            const matchIndex = match.index as number;
            const matchLength = match[0].length;
            const preMatch = noteText.substring(0, matchIndex);
            const matchText = noteText.substring(
                matchIndex,
                matchIndex + matchLength,
            );

            notes.push(<Text key={index}>{preMatch}</Text>);
            notes.push(
                <Text key={index + 1} style={styles.noteHighlight}>
                    {matchText}
                </Text>,
            );

            noteText = noteText.substring(matchIndex + matchLength);

            match = noteText.match(BlockNameRegex);
            index += 2;
        }

        notes.push(<Text key={index}>{noteText}</Text>);
    }

    return (
        <View style={[style, styles.container]}>
            <View style={[styles.topRow]}>
                <Text style={[styles.name]}>
                    <Text style={[styles.nameBold]}>
                        {splitTeacherName[0].toUpperCase()}
                    </Text>
                    , {splitTeacherName[1]}
                </Text>
                {teacher.time && teacher.time.trim().length > 0 ? (
                    <Text style={[styles.time]}>{teacher.time.trim()}</Text>
                ) : null}
            </View>

            {notes.length > 0 ? (
                <Text style={[styles.note]}>{notes}</Text>
            ) : null}

            {!last && <Divider style={styles.divider} />}
        </View>
    );
}

export default AllTeacherCard;
