import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../Theme';
import InverseWave from './InverseWave';
import { useAppState } from '../../state/AppStateContext';

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
    const appState = useAppState();
    return (
        <View
            style={[
                style,
                styles.container,
                {
                    minHeight: Math.max(150, appState.value.tallestWaveHeader),
                },
            ]}
            onLayout={(event: any) => {
                const { height } = event.nativeEvent.layout;
                if (height > appState.value.tallestWaveHeader) {
                    appState.setAppState((oldState) => ({
                        ...oldState,
                        tallestWaveHeader: height,
                    }));
                }
            }}
        >
            <InverseWave style={styles.wave} />
            <Text
                style={[
                    styles.header,
                    // eslint-disable-next-line no-nested-ternary
                    iconName
                        ? isLeft
                            ? styles.headerWithLeftIcon
                            : styles.headerWithRightIcon
                        : null,
                ]}
            >
                {text}
            </Text>

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
        justifyContent: 'center',
    },
    wave: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    header: {
        fontFamily: Theme.headerFont,
        color: Theme.foregroundAlternate,
        fontSize: 38,
        marginTop: 20,
        marginHorizontal: 30,
        marginBottom: 50,
    },
    headerWithRightIcon: {
        paddingRight: 30,
    },
    headerWithLeftIcon: {
        paddingRight: 30,
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
