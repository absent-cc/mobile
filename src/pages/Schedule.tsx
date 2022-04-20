import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Theme from '../Theme';
import WithWaveHeader from '../components/header/WithWaveHeader';
import PillButtons from '../components/button/PillButtons';
import BlockCard from '../components/schedule/BlockCard';
import { Block } from '../api/APITypes';
import FullWeek from '../components/schedule/FullWeek';
import PassingTimeCard from '../components/schedule/PassingTimeCard';

function Schedule() {
    const [activeTab, setActiveTab] = React.useState(0);

    let body;

    if (activeTab === 0) {
        body = (
            <>
                <BlockCard style={styles.blockCard} block={Block.A} />
                <PassingTimeCard
                    style={styles.blockCard}
                    startTime="09:00:00"
                    endTime="09:00:00"
                />
                <BlockCard style={styles.blockCard} block={Block.B} />
                <BlockCard
                    style={styles.blockCard}
                    block={Block.C}
                    // isLunch
                    // isActive
                    // activeLunch={0}
                />
                <BlockCard style={styles.blockCard} block={Block.D} />
                <BlockCard style={styles.blockCard} block={Block.E} />
            </>
        );
    } else {
        body = <FullWeek />;
    }

    return (
        <WithWaveHeader style={styles.pageView} text="Your Schedule">
            <PillButtons
                buttons={[{ text: 'Today' }, { text: 'Week' }]}
                defaultValue={0}
                onPress={setActiveTab}
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
    blockCard: {
        marginBottom: 20,
    },
});

export default Schedule;
