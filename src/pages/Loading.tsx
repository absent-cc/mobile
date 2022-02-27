import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Theme from '../Theme';

function Loading() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ActivityIndicator size="large" color={Theme.primaryColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Loading;
