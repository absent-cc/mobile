import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AbsenceItem } from '../../AbsenceCalculator';
import { Block, TeacherBlock } from '../../api/APITypes';
import { BlockNameRegex } from '../../DateWordUtils';
import { useTheme } from '../../theme/ThemeContext';
import { ShortBlocks } from '../../Utils';

function TeacherCard({
    style,
    absenceItem,
}: {
    absenceItem: AbsenceItem;
    style?: any;
}) {
    const { Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                blockBox: {
                    // width: 70,
                    // height: 70,
                    flex: 1,
                    padding: 4,
                    aspectRatio: 1,
                    marginRight: 20,
                    backgroundColor: Theme.primaryColor,
                    borderRadius: 20,

                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    flex: 4,
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
                    color: Theme.foregroundColor,
                },
                time: {
                    fontFamily: Theme.italicFont,
                    color: Theme.darkForeground,
                    marginTop: 0,
                    fontSize: 20,
                },
                note: {
                    fontFamily: Theme.regularFont,
                    // marginTop: 10,
                    fontSize: 20,
                    color: Theme.foregroundColor,
                },
                noteHighlight: {
                    textDecorationLine: 'underline',
                    textDecorationColor: Theme.primaryColor,
                    textDecorationStyle: 'solid',
                    fontFamily: Theme.strongFont,
                },
                free: {
                    fontFamily: Theme.strongFont,
                    fontSize: 20,
                    color: Theme.foregroundColor,
                },
                freeNote: {
                    color: Theme.darkForeground,
                    fontFamily: Theme.italicFont,
                    marginTop: 0,
                    fontSize: 20,
                },
            }),
        [Theme],
    );

    let boxContent;

    if (absenceItem.block === TeacherBlock.ADVISORY) {
        boxContent = (
            <Text style={styles.adv}>{ShortBlocks[Block.ADVISORY]}</Text>
        );
    } else if (absenceItem.block === TeacherBlock.EXTRA) {
        boxContent = <Feather name="plus" style={styles.icon} size={40} />;
    } else {
        boxContent = (
            <Text style={styles.block} allowFontScaling={false}>
                {ShortBlocks[absenceItem.block]}
            </Text>
        );
    }

    const notes = [];

    if (
        absenceItem.teacher?.note &&
        absenceItem.teacher?.note.trim().length > 0
    ) {
        let index = 0;
        let noteText = absenceItem.teacher?.note.trim();
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
                        {notes.length > 0 ? (
                            <Text style={[styles.note]}>{notes}</Text>
                        ) : null}
                    </>
                )}
            </View>
        </View>
    );
}

export default TeacherCard;
