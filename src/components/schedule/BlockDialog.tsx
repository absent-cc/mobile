import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DayBlock } from '../../api/APITypes';
import { toTimeString } from '../../DateWordUtils';
import { TimeRelation, useAppState } from '../../state/AppStateContext';
import { useSettings } from '../../state/SettingsContext';
import { useTheme } from '../../theme/ThemeContext';
import {
    DayBlockFullNames,
    isTeacherBlock,
    LunchNames,
    toTeacherBlockUnsafe,
} from '../../Utils';

function BlockDialog({
    style,
    close,
    dayBlock,
    isActive,
}: {
    style?: any;
    close: () => void;
    dayBlock: DayBlock;
    isActive: boolean;
}) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: '100%',
                    backgroundColor: Theme.lighterForeground,
                    padding: 40,
                    paddingRight: 60,

                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,

                    elevation: 5,
                },
                close: {
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    borderRadius: 50,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                },
                closePressed: {
                    backgroundColor: Theme.lightForeground,
                },
                icon: {
                    color: Theme.foregroundColor,
                },
                row: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    alignItems: 'stretch',
                },
                name: {
                    fontFamily: Theme.strongFont,
                    fontSize: 25,
                    color: Theme.foregroundColor,
                    marginBottom: 5,
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
                    color: Theme.darkForeground,
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
                    fontFamily: Theme.italicFont,
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
            }),
        [Theme],
    );

    const insets = useSafeAreaInsets();
    const { value: appState } = useAppState();

    const activeLunch = appState.current.lunch;
    const activeLunchRelation = appState.current.lunchRelation;

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
                styles.container,
                { paddingBottom: insets.bottom + 40 },
                style,
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.close,
                    pressed ? styles.closePressed : undefined,
                ]}
                onPress={close}
            >
                <Feather style={[styles.icon]} name="x" size={24} />
            </Pressable>
            <Text style={[styles.name]}>
                {DayBlockFullNames[dayBlock.block]}
            </Text>
            <Text style={[styles.time]}>
                {toTimeString(dayBlock.startTime)}
                {' - '}
                {toTimeString(dayBlock.endTime)}
            </Text>
            {teacherName && <Text style={[styles.note]}>{teacherName}</Text>}
            {dayBlock.lunches && (
                <View style={[styles.row]}>
                    {dayBlock.lunches.map((lunch, index) => (
                        <React.Fragment key={lunch.lunch}>
                            <View
                                style={[
                                    styles.lunchBox,
                                    activeLunch === lunch.lunch &&
                                        activeLunchRelation ===
                                            TimeRelation.Current &&
                                        isActive &&
                                        styles.currentLunch,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.lunchName,
                                        activeLunch === lunch.lunch &&
                                            activeLunchRelation ===
                                                TimeRelation.Current &&
                                            isActive &&
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
                                            isActive &&
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
                                // only render divider if not last lunch
                                index < (dayBlock.lunches?.length ?? 0) - 1 && (
                                    <View
                                        style={[
                                            styles.lunchDivider,
                                            activeLunch === lunch.lunch &&
                                                activeLunchRelation ===
                                                    TimeRelation.After &&
                                                isActive &&
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

export default BlockDialog;
