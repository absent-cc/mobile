import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import WaveHeader from './WaveHeader';
import { useAppState } from '../../state/AppStateContext';
import { useTheme } from '../../theme/ThemeContext';

const WithWaveHeader = React.forwardRef(
    (
        {
            children,
            style,
            iconName,
            iconClick,
            text,
            isLeft = false,
            refreshControl,
            reversed = false,
            footer,
            largeBottom = false,
            saveHeaderSize = true,
        }: {
            children: React.ReactNode;
            style?: any;
            iconName?: keyof typeof Feather.glyphMap;
            iconClick?: () => void;
            text: string;
            isLeft?: boolean;
            refreshControl?: React.ReactElement;
            reversed?: boolean;
            footer?: React.ReactNode;
            largeBottom?: boolean;
            saveHeaderSize?: boolean;
        },
        ref: React.ForwardedRef<ScrollView | null>,
    ) => {
        const { Theme } = useTheme();

        const styles = React.useMemo(
            () =>
                StyleSheet.create({
                    container: {
                        width: '100%',
                        flex: 1,
                        backgroundColor: Theme.backgroundColor,
                    },
                    scroller: {
                        width: '100%',
                    },
                    contentContainer: {
                        width: '100%',
                    },
                    gradientBg: {
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                    },
                    content: {
                        paddingHorizontal: 30,
                        paddingTop: 15,
                        paddingBottom: 50,
                        backgroundColor: Theme.backgroundColor,
                        flex: 1,
                    },
                    contentLargeBottom: {
                        paddingBottom: 450,
                    },
                }),
            [Theme],
        );

        const insets = useSafeAreaInsets();
        const appState = useAppState();
        const [scrollHeight, setScrollHeight] = React.useState(0);

        return (
            <View style={[style, styles.container]}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={[
                        Theme.secondaryColor,
                        Theme.primaryColor,
                        Theme.tertiaryColor,
                    ]}
                    locations={[0, 0.5, 1]}
                    start={reversed ? { x: 1.0, y: 0.0 } : { x: 0.0, y: 0.0 }}
                    end={reversed ? { x: 0.0, y: 1.0 } : { x: 1.0, y: 1.0 }}
                    style={[
                        styles.gradientBg,
                        {
                            // get height, but make sure it's at least the top inset
                            height: Math.max(
                                appState.value.tallestWaveHeader +
                                    insets.top +
                                    scrollHeight +
                                    80,
                                insets.top,
                            ),
                        },
                    ]}
                />
                <ScrollView
                    style={[
                        styles.scroller,
                        {
                            marginTop: insets.top,
                        },
                    ]}
                    contentContainerStyle={styles.contentContainer}
                    // contentInset={{ top: }}
                    refreshControl={refreshControl}
                    onScroll={(event: any) => {
                        const height = event.nativeEvent.contentOffset.y;
                        setScrollHeight(height * -1);
                    }}
                    scrollEventThrottle={16}
                    // bounces={false}
                    ref={ref}
                    keyboardShouldPersistTaps="handled"
                >
                    <WaveHeader
                        iconName={iconName}
                        iconClick={iconClick}
                        text={text}
                        isLeft={isLeft}
                        saveHeaderSize={saveHeaderSize}
                    />
                    <View
                        style={[
                            styles.content,
                            largeBottom && styles.contentLargeBottom,
                        ]}
                    >
                        {children}
                    </View>
                </ScrollView>
                {footer}
            </View>
        );
    },
);

export default WithWaveHeader;
