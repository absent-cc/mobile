import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../Theme';
import Wave from './Wave';

function WaveHeader({
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
            <Wave style={styles.wave} />
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
        height: 250,
    },
    wave: {
        width: '100%',
        height: 250,
        position: 'absolute',
    },
    header: {
        fontFamily: Theme.strongFont,
        color: Theme.foregroundAlternate,
        fontSize: 38,
        position: 'absolute',
        left: 30,
        right: 30,
        bottom: 100,
    },
    icon: {
        position: 'absolute',
        top: 20,
        color: Theme.foregroundAlternate,
    },
    iconLeft: {
        left: 20,
    },
    iconRight: {
        right: 20,
    },
});

export default WaveHeader;
