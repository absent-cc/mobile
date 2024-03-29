import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Header from './Header';
import { useTheme } from '../../theme/ThemeContext';

const WithHeader = React.forwardRef(
    (
        {
            children,
            style,
            iconName,
            iconClick,
            text,
            isLeft = false,
            refreshControl,
            footer,
            largeBottom = false,
        }: {
            children: React.ReactNode;
            style?: any;
            iconName?: keyof typeof Feather.glyphMap;
            iconClick?: () => void;
            text: string;
            isLeft?: boolean;
            refreshControl?: React.ReactElement;
            footer?: React.ReactNode;
            largeBottom?: boolean;
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
                    },
                    contentLargeBottom: {
                        paddingBottom: 450,
                    },
                }),
            [Theme],
        );

        const insets = useSafeAreaInsets();

        return (
            <View style={[style, styles.container]}>
                <StatusBar style="dark" />
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
                    scrollEventThrottle={16}
                    // bounces={false}
                    ref={ref}
                    keyboardShouldPersistTaps="handled"
                >
                    <Header
                        iconName={iconName}
                        iconClick={iconClick}
                        text={text}
                        isLeft={isLeft}
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

export default WithHeader;
