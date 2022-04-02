import { StyleSheet, Text, RefreshControl } from 'react-native';
import React from 'react';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import Theme from '../Theme';
import TeacherCard from '../components/card/TeacherCard';
import Divider from '../components/Divider';
import { useSettings } from '../state/SettingsContext';
import { joinListWithCommas, ShortBlockFullNames, splitName } from '../Utils';
import { useAPI } from '../api/APIContext';
import absenceCalculator from '../AbsenceCalculator';
import { useAppState } from '../state/AppStateContext';
import { dateFormatter, timeOfDay, toWords } from '../DateWordUtils';
import RowButton from '../components/RowButton';
import WithWaveHeader from '../components/header/WithWaveHeader';

function Home({ navigation }: { navigation: any }) {
    const { value: settings, setSettings } = useSettings();
    const { value: appState, setAppState } = useAppState();
    const { fetchAbsences, fetchSettings, getClassesToday } = useAPI();

    React.useEffect(() => {
        // get notfication permission
        notifee.requestPermission();
    }, []);

    React.useEffect(() => {
        const unsubscribe = messaging().onMessage(async () => {
            setRefreshing(true);
        });

        return unsubscribe;
    }, []);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
    }, []);

    // refresh
    React.useEffect(() => {
        if (refreshing) {
            Promise.all([
                fetchSettings(),
                fetchAbsences(),
                getClassesToday(),
            ]).then(([newSettings, absences, classesToday]) => {
                setRefreshing(false);
                setAppState((oldAppState) => {
                    const stateChanges = {
                        ...oldAppState,
                        // needsUpdate: false,
                    };
                    if (absences !== null) stateChanges.absences = absences;
                    if (classesToday !== null)
                        stateChanges.blocksToday = classesToday;
                    return stateChanges;
                });
                setSettings((oldSettings) => {
                    const stateChanges = {
                        ...oldSettings,
                    };
                    if (newSettings !== null) {
                        stateChanges.user = newSettings.user;
                        stateChanges.schedule = newSettings.schedule;
                        stateChanges.app = newSettings.app;
                    }
                    return stateChanges;
                });
            });
        }
    }, [
        fetchAbsences,
        fetchSettings,
        getClassesToday,
        refreshing,
        setAppState,
        setSettings,
    ]);

    const now = new Date(appState.lastUpdateTime);
    const [timeWords, timeEmoji] = timeOfDay(now);

    let body;

    if (appState.blocksToday?.length === 0) {
        body = (
            <Text style={styles.status}>
                No school today! Enjoy your day! 🎉
            </Text>
        );
    } else if (appState.absences?.length === 0) {
        body = (
            <Text style={styles.status}>
                The absence list hasn't been posted yet, check back later! 🥱
            </Text>
        );
    } else {
        const { teachersAbsent, extraAbsent } = absenceCalculator(
            settings.schedule,
            appState.blocksToday,
            appState.absences,
            settings.app.showFreeBlocks,
        );
        const numFrees = teachersAbsent.filter((teach) => teach.isFree).length;
        const numTeachersAbsent =
            teachersAbsent.length - numFrees + extraAbsent.length;

        const teacherCards = teachersAbsent.map((absenceItem) => (
            <TeacherCard
                style={styles.card}
                absenceItem={absenceItem}
                key={`${absenceItem.block}-${
                    absenceItem.teacher?.teacher.name || 'free'
                }`}
            />
        ));

        const extraCards = extraAbsent.map((absenceItem) => (
            <TeacherCard
                style={styles.card}
                absenceItem={absenceItem}
                key={`${absenceItem.block}-${
                    absenceItem.teacher?.teacher.name || 'free'
                }`}
            />
        ));

        body = (
            <>
                {numTeachersAbsent + numFrees > 0 ? (
                    <Text style={styles.status}>
                        You have{' '}
                        {numTeachersAbsent > 0 && (
                            <>
                                <Text style={styles.count}>
                                    {toWords(numTeachersAbsent)}
                                </Text>
                                absent teacher
                                {numTeachersAbsent !== 1 ? 's' : ''}{' '}
                            </>
                        )}
                        {numTeachersAbsent > 0 && numFrees > 0 && 'and '}
                        {numFrees > 0 && (
                            <>
                                <Text style={styles.count}>
                                    {toWords(numFrees)}
                                </Text>
                                free block
                                {numFrees !== 1 ? 's' : ''}{' '}
                            </>
                        )}
                        today!
                    </Text>
                ) : (
                    <Text style={styles.status}>
                        You have no cancelled classes today. Check back
                        tomorrow!
                    </Text>
                )}

                <RowButton
                    onPress={() => {
                        navigation.navigate('FullList');
                    }}
                    label="See full absence list"
                    style={{ marginTop: 10 }}
                />

                {teacherCards.length > 0 && (
                    <>
                        <Text style={styles.header}>Cancelled Classes</Text>
                        {teacherCards}
                    </>
                )}

                {extraCards.length > 0 && (
                    <>
                        <Text style={styles.header}>Extra Teachers</Text>
                        {extraCards}
                    </>
                )}
            </>
        );
    }

    return (
        <WithWaveHeader
            style={[styles.pageView]}
            iconName="settings"
            iconClick={() => {
                navigation.navigate('Settings');
            }}
            text={
                settings.user.name.length > 0
                    ? `Good ${timeWords}, ${
                          splitName(settings.user.name)[0]
                      }! ${timeEmoji}`
                    : `Good ${timeWords}! ${timeEmoji}`
            }
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={Theme.foregroundAlternate}
                    colors={[
                        Theme.foregroundAlternate,
                        Theme.lighterForeground,
                    ]}
                />
            }
        >
            <Text style={styles.hello}>
                Today is <Text style={styles.date}>{dateFormatter(now)}</Text>.
            </Text>
            {appState.blocksToday?.length > 0 && (
                <Text style={styles.blockList}>
                    The blocks today are{' '}
                    {joinListWithCommas(
                        appState.blocksToday.map(
                            (block) => ShortBlockFullNames[block],
                        ),
                    )}
                    .
                </Text>
            )}
            <Divider />
            {body}
        </WithWaveHeader>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        // backgroundColor: Theme.backgroundColor,
    },
    hello: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    blockList: {
        marginTop: 20,
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    date: {
        fontFamily: Theme.strongFont,
    },
    count: {
        fontFamily: Theme.strongFont,
    },
    status: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    card: {
        marginTop: 20,
    },
    header: {
        color: Theme.foregroundColor,
        fontFamily: Theme.headerFont,
        fontSize: 30,
        marginTop: 20,
    },
});

export default Home;
