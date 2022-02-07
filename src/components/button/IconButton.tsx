import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../Theme';

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
            style={({ pressed }) => [
                style,
                styles.base,
                isFilled ? styles.filled : styles.outline,
                // eslint-disable-next-line no-nested-ternary
                pressed
                    ? isFilled
                        ? styles.pressedFilled
                        : styles.pressedOutline
                    : null,
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
    pressedFilled: {
        backgroundColor: Theme.darkerPrimary,
        borderColor: Theme.darkerPrimary,
    },
    pressedOutline: {},

    icon: {},
    filledIcon: {
        color: Theme.foregroundAlternate,
    },
    outlineIcon: {
        color: Theme.primaryColor,
    },
});

export default IconButton;
