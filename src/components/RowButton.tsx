import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../Theme';

function RowButton({
    label,
    style,
    onPress,
}: {
    label?: string;
    style?: any;
    onPress: () => void;
}) {
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

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    label: {
        fontFamily: Theme.regularFont,
        fontSize: 20,
        flex: 1,
    },
    button: {
        color: Theme.lightForeground,
        flex: 0,
    },
});

export default RowButton;
