import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

function RowButton({
    label,
    style,
    onPress,
}: {
    label?: string;
    style?: any;
    onPress: () => void;
}) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    paddingVertical: 8,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                },
                label: {
                    fontFamily: Theme.regularFont,
                    color: Theme.foregroundColor,
                    fontSize: 20,
                    flex: 1,
                },
                button: {
                    color: Theme.lightForeground,
                    flex: 0,
                },
            }),
        [Theme],
    );

    return (
        <View style={style}>
            <Pressable style={[styles.container]} onPress={onPress}>
                <Text style={styles.label}>{label}</Text>
                <Feather
                    onPress={onPress}
                    name="chevron-right"
                    size={30}
                    style={styles.button}
                />
            </Pressable>
        </View>
    );
}

export default RowButton;
