import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    RefreshControl,
} from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';
import WaveHeader from '../components/header/WaveHeader';
import TeacherCard from '../components/card/TeacherCard';
import Divider from '../components/Divider';
import WaveHeaderSafearea from '../components/header/WaveHeaderSafearea';
import { useSettings } from '../state/SettingsContext';
import { Block } from '../api/APITypes';
import { splitName } from '../Utils';
import { useAPI } from '../state/APIContext';

function Home({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const settings = useSettings();
    const api = useAPI();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    React.useEffect(() => {
        if (refreshing) {
            Promise.all([api.fetchSettings(), api.fetchAbsences()]).then(() => {
                setRefreshing(false);
            });
        }
    }, [refreshing, api]);

    return (
        <View style={styles.pageView}>
            <WaveHeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Theme.lightForeground}
                        colors={[Theme.primaryColor, Theme.secondaryColor]}
                    />
                }
                // bounces={false}
            >
                <WaveHeader
                    iconName="settings"
                    iconClick={() => {
                        navigation.navigate('Settings');
                    }}
                    text={
                        settings.value.user.name.length > 0
                            ? `Good morning, ${
                                  splitName(settings.value.user.name)[0]
                              }! ☀️`
                            : 'Good morning! ☀️'
                    }
                />
                <View style={styles.content}>
                    <Text style={styles.hello}>
                        Today is{' '}
                        <Text style={styles.date}>Sunday, January 16</Text>. ☀️
                    </Text>
                    <Divider />
                    <Text style={styles.status}>
                        You have <Text style={styles.count}>three</Text> free
                        blocks today!
                    </Text>
                    <TeacherCard
                        style={styles.card}
                        teacher={{
                            name: 'Kevin McFakehead',
                            time: 'All Day',
                            notes: 'All classes cancelled',
                        }}
                        block={Block.A}
                    />
                    <TeacherCard style={styles.card} block={Block.E} isFree />
                    <TeacherCard
                        style={styles.card}
                        teacher={{
                            name: 'Margaret Moon',
                            time: 'Partial Day AM',
                            notes: 'All classes cancelled',
                        }}
                        block={Block.ADV}
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
});

export default Home;
