import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Theme from '../../Theme';
import { Feather } from '@expo/vector-icons';

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
    return (
        <Pressable
            style={[
                style,
                styles.base,
                isFilled ? styles.filled : styles.outline,
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

const styles = StyleSheet.create({
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
});

export default TextButton;
