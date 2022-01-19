import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Theme from '../../Theme';
import { Feather } from '@expo/vector-icons';

function Header({
    iconName,
    iconClick,
    text,
    style,
    isLeft = false,
}: {
    iconName?: keyof typeof Feather.glyphMap;
    iconClick?: () => void;
    text: string;
    style?: any;
    isLeft?: boolean;
}) {
    return (
        <View style={[style, styles.container]}>
            <Text style={styles.header}>{text}</Text>
            {iconName && iconClick ? (
                <Feather
                    style={[
                        styles.icon,
                        isLeft ? styles.iconLeft : styles.iconRight,
                    ]}
                    name={iconName}
                    onPress={iconClick}
                    size={40}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
    },
    header: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundColor,
        fontSize: 35,
        position: 'absolute',
        left: 30,
        right: 30,
        bottom: 20,
    },
    icon: {
        position: 'absolute',
        top: 20,
        right: 20,
        color: Theme.primaryColor,
    },
    iconLeft: {
        left: 20,
    },
    iconRight: {
        right: 20,
    },
});

export default Header;
