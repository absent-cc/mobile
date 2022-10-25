import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

function TextButton({
    children,
    style,
    isFilled = false,
    onPress,
    iconName,
}: {
    children: any;
    style?: any;
    isFilled?: boolean;
    onPress: () => void;
    iconName?: keyof typeof Feather.glyphMap;
}) {
    const { Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                base: {
                    borderRadius: 50,
                    width: '100%',
                    padding: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                filled: {
                    backgroundColor: Theme.primaryColor,
                    borderWidth: 2,
                    borderColor: Theme.primaryColor,
                },
                outline: {
                    backgroundColor: Theme.backgroundColor,
                    borderWidth: 2,
                    borderColor: Theme.primaryColor,
                },
                pressedFilled: {
                    backgroundColor: Theme.darkerPrimary,
                    borderColor: Theme.darkerPrimary,
                },
                pressedOutline: {
                    backgroundColor: Theme.lighterForeground,
                },

                text: {
                    fontSize: 20,
                    fontFamily: Theme.strongFont,
                    textAlign: 'center',
                },
                filledText: {
                    color: Theme.foregroundAlternate,
                },
                outlineText: {
                    color: Theme.primaryColor,
                },

                icon: {
                    marginRight: 8,
                },
                filledIcon: {
                    color: Theme.foregroundAlternate,
                },
                outlineIcon: {
                    color: Theme.primaryColor,
                },
            }),
        [Theme],
    );

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
            {iconName ? (
                <Feather
                    style={[
                        styles.icon,
                        isFilled ? styles.filledIcon : styles.outlineIcon,
                    ]}
                    name={iconName}
                    size={24}
                />
            ) : null}
            <Text
                style={[
                    styles.text,
                    isFilled ? styles.filledText : styles.outlineText,
                ]}
            >
                {children}
            </Text>
        </Pressable>
    );
}

export default TextButton;
