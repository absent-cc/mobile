import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Theme from '../../Theme';
import { Feather } from '@expo/vector-icons';

function IconButton({
    style,
    isFilled = false,
    onPress,
    iconName,
}: {
    style?: any;
    isFilled?: boolean;
    onPress: () => void;
    iconName: keyof typeof Feather.glyphMap;
}) {
    return (
        <Pressable
            style={[
                style,
                styles.base,
                isFilled ? styles.filled : styles.outline,
            ]}
            onPress={onPress}
        >
            <Feather
                style={[
                    styles.icon,
                    isFilled ? styles.filledIcon : styles.outlineIcon,
                ]}
                name={iconName}
                size={24}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
    },
    filled: {
        backgroundColor: Theme.primaryColor,
    },
    outline: {},

    icon: {},
    filledIcon: {
        color: Theme.foregroundAlternate,
    },
    outlineIcon: {
        color: Theme.primaryColor,
    },
});

export default IconButton;
