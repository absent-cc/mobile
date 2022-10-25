import { ScrollView, StyleSheet, Text } from 'react-native';
import React from 'react';
import { useAppState } from '../state/AppStateContext';
import AllTeacherCard from '../components/card/AllTeacherCard';
import WithWaveHeader from '../components/header/WithWaveHeader';
import { useTheme } from '../theme/ThemeContext';

function FullList({ navigation }: { navigation: any }) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                pageView: {
                    flex: 1,
                    width: '100%',
                    backgroundColor: Theme.backgroundColor,
                },
                hello: {
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
                    marginTop: 10,
                    color: Theme.foregroundColor,
                    fontFamily: Theme.regularFont,
                    fontSize: 20,
                },
                card: {
                    // marginBottom: 15,
                },
                header: {
                    color: Theme.foregroundColor,
                    fontFamily: Theme.headerFont,
                    fontSize: 30,
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

    const { value: appState } = useAppState();

    let body;

    if (appState.dayBlocksToday?.length === 0) {
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
        body = appState.absences
            ?.sort(
                // sort alphabetically
                (a, b) =>
                    a.teacher.reversedSplitName[0].localeCompare(
                        b.teacher.reversedSplitName[0],
                    ),
            )
            .filter((value) => value.teacher.name.length > 0)
            .map((absence, index, all) => {
                return (
                    <AllTeacherCard
                        teacher={absence}
                        key={absence.teacher.tid}
                        style={[
                            styles.card,
                            index === 0 && {
                                marginTop: 10,
                            },
                        ]}
                        last={index === all.length - 1}
                    />
                );
            });
    }

    return (
        <WithWaveHeader
            style={styles.pageView}
            text="All Absences"
            reversed
            ref={scrollRef}
        >
            {body}
        </WithWaveHeader>
    );
}

export default FullList;
