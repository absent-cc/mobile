import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';
import Header from '../../components/header/Header';
import SwitchField from '../../components/input/Switch';
import HeaderSafearea from '../../components/header/HeaderSafearea';

function AppSettings({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.pageView}>
            <HeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
            >
                <Header
                    iconName="chevron-left"
                    iconClick={() => {
                        navigation.goBack();
                    }}
                    isLeft
                    text="App Options"
                />
                <View style={styles.content}>
                    <Text style={styles.note}>Edit app options.</Text>
                    <SwitchField
                        style={styles.inputField}
                        label="Show free blocks as absent teachers"
                        onChange={() => {
                            // TODO
                        }}
                    />

                    <SwitchField
                        style={styles.inputField}
                        label="Send notifications"
                        onChange={() => {
                            // TODO
                        }}
                    />

                    <SwitchField
                        style={styles.inputField}
                        label="Send notification even if no teachers are absent"
                        onChange={() => {
                            // TODO
                        }}
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
        paddingBottom: 200,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 16,
        marginBottom: 16,
    },
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
});

export default AppSettings;
