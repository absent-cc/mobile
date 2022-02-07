import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Theme from '../../Theme';

function WaveHeaderSafearea({ style }: { style?: any }) {
    const insets = useSafeAreaInsets();

    const totalHeight = 300 + insets.top;

    return (
        <LinearGradient
            colors={[
                Theme.secondaryColor,
                Theme.primaryColor,
                Theme.tertiaryColor,
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0.0, y: insets.top / totalHeight }}
            end={{ x: 1.0, y: 1.0 }}
            style={[
                styles.grad,
                {
                    height: totalHeight,
                },
                style,
            ]}
        >
            <StatusBar style="light" />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    grad: {
        position: 'absolute',
        width: '100%',
    },
});

export default WaveHeaderSafearea;
