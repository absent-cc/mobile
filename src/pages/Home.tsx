import { StyleSheet, Text, RefreshControl, ScrollView } from 'react-native';
import React from 'react';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import TeacherCard from '../components/card/TeacherCard';
import Divider from '../components/Divider';
import { useSettings } from '../state/SettingsContext';
import { joinListWithCommas, ShortBlockFullNames, splitName } from '../Utils';
import { useAPI } from '../api/APIContext';
import absenceCalculator from '../AbsenceCalculator';
import { useAppState } from '../state/AppStateContext';
import { dateFormatter, timeOfDay } from '../DateWordUtils';
import WithWaveHeader from '../components/header/WithWaveHeader';
import { useTheme } from '../theme/ThemeContext';

function Home({ navigation }: { navigation: any }) {
    const {
        Theme,
        elements,
        message: themeMessage,
        emoji: themeEmoji,
    } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                pageView: {
                    flex: 1,
                    width: '100%',
                    // backgroundColor: Theme.backgroundColor,
                },
                hello: {
                    color: Theme.foregroundColor,
                    fontFamily: Theme.regularFont,
                    fontSize: 20,
                    marginTop: 10,
                },
                themeMessage: {
                    color: Theme.foregroundColor,
                    fontFamily: Theme.regularFont,
                    fontSize: 20,
                    marginTop: 5,
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
                    // marginTop: 40,
                    color: Theme.foregroundColor,
                    fontFamily: Theme.regularFont,
                    fontSize: 20,
                },
                boldStatus: {
                    fontFamily: Theme.strongFont,
                },
                blockName: {
                    fontFamily: Theme.strongFont,
                    // backgroundColor: 'green',
                },
                card: {
                    marginTop: 20,
                },
                header: {
                    color: Theme.foregroundColor,
                    fontFamily: Theme.headerFont,
                    fontSize: 27,
                    marginTop: 30,
                    marginBottom: -5,
                },
            }),
        [Theme],
    );

    // scrolling
    const scrollRef = React.useRef<ScrollView | null>(null);

    // automatically close the dialog on side swipe and scroll to top
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if (scrollRef.current) {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        });

        return unsubscribe;
    }, [navigation]);

    // scroll to top when focused
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if (scrollRef.current && navigation.isFocused()) {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        });

        return unsubscribe;
    }, [navigation]);

    const { value: settings } = useSettings();
    const { value: appState } = useAppState();
    const { refreshData } = useAPI();

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
            refreshData().then(() => {
                setRefreshing(false);
            });
        }
    }, [refreshData, refreshing]);

    const now = appState.lastUpdateTime;
    const [timeWords, timeEmoji] = timeOfDay(now);

    let body;

    if (appState.dayBlocksToday?.length === 0) {
        body = (
            <>
                <Divider />
                <Text style={styles.status}>
                    No school today! Enjoy your day! 🎉
                </Text>
            </>
        );
    } else if (appState.absences?.length === 0) {
        body = (
            <>
                <Divider />
                <Text style={styles.status}>
                    The absence list hasn't been posted yet, check back later!
                    🥱
                </Text>
            </>
        );
    } else {
        const { teachersAbsent, extraAbsent } = absenceCalculator(
            settings.schedule,
            appState.teacherBlocksToday,
            appState.absences,
            settings.app.showFreeBlocks,
        );
        // const numFrees = teachersAbsent.filter((teach) => teach.isFree).length;
        // const numTeachersAbsent =
        //     teachersAbsent.length - numFrees + extraAbsent.length;

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
                {/* {numTeachersAbsent + numFrees > 0 ? (
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
                )} */}

                {teacherCards.length + extraCards.length === 0 && (
                    <>
                        <Divider />
                        <Text style={styles.status}>
                            You have <Text style={styles.boldStatus}>no</Text>{' '}
                            cancelled classes today. Check back tomorrow!
                        </Text>
                    </>
                )}

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
                      }! ${themeEmoji ?? timeEmoji}`
                    : `Good ${timeWords}! ${themeEmoji ?? timeEmoji}`
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
            ref={scrollRef}
        >
            <Text style={styles.hello}>
                Today is <Text style={styles.date}>{dateFormatter(now)}</Text>.
            </Text>
            {themeMessage && (
                <Text style={styles.themeMessage}>{themeMessage}</Text>
            )}
            {appState.dayBlocksToday?.length > 0 && (
                <Text style={styles.blockList}>
                    The blocks are{' '}
                    {joinListWithCommas(
                        appState.dayBlocksToday.map((block) => (
                            <Text style={styles.blockName} key={block}>
                                {ShortBlockFullNames[block]}
                            </Text>
                        )),
                    )}
                    .
                </Text>
            )}
            {elements.Animation}
            {/* <Divider /> */}
            {body}
        </WithWaveHeader>
    );
}

export default Home;
