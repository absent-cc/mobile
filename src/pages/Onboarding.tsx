import { StyleSheet, Text, ScrollView, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';
import Divider from '../components/Divider';
import TextField from '../components/input/TextField';
import Dropdown from '../components/input/Dropdown';
import TextButton from '../components/button/TextButton';
import WaveHeader from '../components/header/WaveHeader';
import ClassInput from '../components/ClassInput';
import ExtraTeachers from '../components/ExtraTeachers';
import WaveHeaderSafearea from '../components/header/WaveHeaderSafearea';
import { Block } from '../api/APITypes';

function Onboarding({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.pageView}>
            <WaveHeaderSafearea />
            <ScrollView
                style={[styles.container, { marginTop: insets.top }]}
                // bounces={false}
            >
                <WaveHeader
                    text="Welcome! 👋"
                    iconName="x"
                    iconClick={() => {
                        navigation.goBack('Home');
                    }}
                />
                <View style={styles.content}>
                    <Text style={styles.text}>Let's set up your account.</Text>
                    <Divider />
                    <TextField
                        label="What's your name?"
                        onChange={() => {
                            // TODO
                        }}
                        placeholder="e.g. Kevin McFakehead"
                        style={styles.inputField}
                    />
                    <TextField
                        label="What grade are you in?"
                        onChange={() => {
                            // TODO
                        }}
                        placeholder="e.g. 10"
                        style={styles.inputField}
                        isNumber
                    />
                    <Dropdown
                        label="Which school do you go to?"
                        onChange={() => {
                            // TODO
                        }}
                        style={[styles.inputField, styles.dropdown]}
                        placeholder="Select a school"
                        options={['South', 'North']}
                        defaultValue={-1}
                    />
                    <Divider />
                    <Text style={styles.header}>Classes</Text>
                    <Text style={styles.note}>
                        Tap on each block to set up your classes.
                    </Text>

                    <ClassInput style={styles.classInput} blockId={Block.A} />
                    <ClassInput style={styles.classInput} blockId={Block.B} />
                    <ClassInput style={styles.classInput} blockId={Block.C} />
                    <ClassInput style={styles.classInput} blockId={Block.D} />
                    <ClassInput style={styles.classInput} blockId={Block.E} />
                    <ClassInput style={styles.classInput} blockId={Block.F} />
                    <ClassInput style={styles.classInput} blockId={Block.G} />
                    <ClassInput style={styles.classInput} blockId={Block.ADV} />

                    <Text style={styles.header}>Extra Teachers</Text>
                    <Text style={styles.note}>
                        Extra teachers allows you to keep track of attendance
                        for other teachers at school.
                    </Text>

                    <ExtraTeachers style={styles.classInput} />
                    <Divider />
                    <TextButton
                        style={styles.inputField}
                        iconName="check-circle"
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        }}
                        isFilled
                    >
                        Get Started!
                    </TextButton>
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
    text: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 20,
    },
    note: {
        color: Theme.foregroundColor,
        fontFamily: Theme.regularFont,
        fontSize: 16,
        marginBottom: 16,
    },
    header: {
        color: Theme.foregroundColor,
        fontFamily: Theme.strongFont,
        fontSize: 30,
        marginBottom: 3,
    },
    inputField: {
        marginTop: 10,
        zIndex: 6,
    },
    dropdown: {
        zIndex: 7,
    },
    classInput: {
        marginBottom: 30,
    },
});

export default Onboarding;
