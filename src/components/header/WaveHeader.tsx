import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InverseWave from './InverseWave';
import { useAppState } from '../../state/AppStateContext';
import { useTheme } from '../../theme/ThemeContext';

function WaveHeader({
    iconName,
    iconClick,
    text,
    style,
    isLeft = false,
    saveHeaderSize,
}: {
    iconName?: keyof typeof Feather.glyphMap;
    iconClick?: () => void;
    text: string;
    style?: any;
    isLeft?: boolean;
    saveHeaderSize: boolean;
}) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
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
                    marginTop: 25,
                    marginHorizontal: 30,
                    marginBottom: 52,
                },
                headerWithRightIcon: {
                    paddingRight: 30,
                },
                headerWithLeftIcon: {
                    paddingRight: 30,
                    marginTop: 80,
                    marginBottom: 70,
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
            }),
        [Theme],
    );

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
                if (
                    saveHeaderSize &&
                    height > appState.value.tallestWaveHeader
                ) {
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

export default WaveHeader;
