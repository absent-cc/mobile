import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

function Divider({ style }: { style?: any }) {
    const { Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    height: 2,
                    width: '100%',
                    // marginHorizontal: '5%',
                    backgroundColor: Theme.lightForeground,
                    marginVertical: 30,
                    borderRadius: 1,
                },
            }),
        [Theme],
    );

    return <View style={[styles.container, style]} />;
}

export default Divider;
