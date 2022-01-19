import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Theme from '../Theme';
import WaveHeader from '../components/header/WaveHeader';
import React from 'react';
import TeacherCard from '../components/card/TeacherCard';
import Divider from '../components/Divider';
import FreeCard from '../components/card/FreeCard';
import WaveHeaderSafearea from '../components/header/WaveHeaderSafearea';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Home({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.pageView}>
            <WaveHeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
            >
                <WaveHeader
                    iconName="settings"
                    iconClick={() => {
                        console.log('settings icon tapped!');
                        navigation.navigate('Settings');
                    }}
                    text={'Good morning, Leah! ☀️'}
                />
                <View style={styles.content}>
                    <Text style={styles.hello}>
                        Today is Sunday, January 16. ☀️
                    </Text>
                    <Divider />
                    <Text style={styles.status}>
                        You have three free blocks today!
                    </Text>
                    <TeacherCard
                        style={styles.card}
                        name="Kevin McFakehead"
                        blockId="a"
                        time="All Day"
                        note="All classes cancelled"
                    />
                    <FreeCard
                        style={styles.card}
                        name="Kerry Marinoff"
                        blockId="e"
                        time="All Day"
                        note="All classes cancelled"
                    />
                    <TeacherCard
                        style={styles.card}
                        name="Margaret Moon"
                        blockId="adv"
                        time="Partial Day AM"
                        note="All classes cancelled"
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    content: {
        paddingHorizontal: 30,
        paddingTop: 5,
        paddingBottom: 80,
    },
    hello: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    status: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    card: {
        marginTop: 20,
    },
});

export default Home;
