import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Theme from '../Theme';
import WithWaveHeader from '../components/header/WithWaveHeader';
import PillButtons from '../components/button/PillButtons';
import FullWeek from '../components/schedule/FullWeek';
import TodaySchedule from '../components/schedule/TodaySchedule';
import { useDialog } from '../components/dialog/Dialog';

function Schedule({ navigation }: { navigation: any }) {
    const { close: closeDialog } = useDialog();
    const [activeTab, setActiveTab] = React.useState(0);

    const changeTab = (newTab: number) => {
        closeDialog();
        setActiveTab(newTab);
    };

    // scrolling
    const scrollRef = React.useRef<ScrollView | null>(null);

    // automatically close the dialog on side swipe and scroll to top
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            closeDialog();
            if (scrollRef.current) {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        });

        return unsubscribe;
    }, [navigation, closeDialog]);

    // scroll to top when focused
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if (scrollRef.current && navigation.isFocused()) {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }
        });

        return unsubscribe;
    }, [navigation]);

    let body;

    if (activeTab === 0) {
        body = <TodaySchedule />;
    } else {
        body = <FullWeek />;
    }

    return (
        <WithWaveHeader
            style={styles.pageView}
            text="Your Schedule"
            ref={scrollRef}
        >
            <PillButtons
                buttons={[{ text: 'Today' }, { text: 'Week' }]}
                defaultValue={0}
                onPress={changeTab}
            />
            <View style={styles.content}>{body}</View>
        </WithWaveHeader>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    status: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    withMargin: {
        marginBottom: 10,
    },
    special: {
        fontFamily: Theme.strongFont,
    },
    content: {
        marginTop: 30,
    },
});

export default Schedule;
