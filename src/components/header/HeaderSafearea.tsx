import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Theme from '../../Theme';

function HeaderSafearea({ style }: { style?: any }) {
    return (
        <View style={[styles.bg, style]}>
            <StatusBar style="dark" />
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        position: 'absolute',
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
});

export default HeaderSafearea;
