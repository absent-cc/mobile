import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

function Loading() {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    width: '100%',
                    backgroundColor: Theme.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }),
        [Theme],
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ActivityIndicator size="large" color={Theme.primaryColor} />
        </View>
    );
}

export default Loading;
