import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

function LoadingCard({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: any;
}) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                icon: {
                    marginRight: 20,
                },
                text: {
                    fontFamily: Theme.strongFont,
                    fontSize: 18,
                    color: Theme.foregroundColor,
                    flex: 1,
                },
            }),
        [Theme],
    );

    return (
        <View style={[style, styles.container]}>
            <ActivityIndicator
                size="small"
                color={Theme.primaryColor}
                style={styles.icon}
            />
            <Text style={[styles.text]}>{children}</Text>
        </View>
    );
}

export default LoadingCard;
