import React from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Route } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../Theme';

function TabBar({
    state,
    // descriptors,
    navigation,
    position,
    tabDisplay,
}: {
    state: any;
    // descriptors: any;
    navigation: any;
    position: Animated.AnimatedInterpolation;
    tabDisplay: Record<
        string,
        { label: string; icon: keyof typeof Feather.glyphMap }
    >;
}) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flexDirection: 'row',
                borderTopWidth: 2,
                borderTopColor: Theme.lightForeground,
            }}
        >
            {state.routes.map((route: Route<string, any>, index: number) => {
                const tabInfo = tabDisplay[route.name];

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.name,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.name,
                    });
                };

                // input range (indices of tabs) = [0, 1, 2, 3, 4]
                // output range (outputs)        = [0, 0, 0, 1, 0]
                const inputRange = state.routes.map((_: any, i: number) => i);
                const outputRange = inputRange.map((i: number) =>
                    i === index ? 1 : 0.0,
                );
                const opacity = position.interpolate({
                    inputRange,
                    outputRange,
                });

                // console.log(color);

                return (
                    <Pressable
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={[styles.button]}
                        key={route.name}
                    >
                        <Animated.View
                            style={[
                                styles.floatingTab,
                                {
                                    paddingBottom: Math.max(20, insets.bottom),
                                },
                                { opacity },
                            ]}
                        >
                            <Feather
                                name={tabInfo.icon}
                                size={24}
                                style={[styles.icon, styles.activeIcon]}
                            />
                            <Text
                                style={[styles.tabText, styles.activeTabText]}
                            >
                                {tabInfo.label}
                            </Text>
                        </Animated.View>
                        <Animated.View
                            style={[
                                styles.fixedTab,
                                {
                                    paddingBottom: Math.max(20, insets.bottom),
                                },
                                { opacity: Animated.subtract(1, opacity) },
                            ]}
                        >
                            <Feather
                                name={tabInfo.icon}
                                size={24}
                                style={[styles.icon]}
                            />
                            <Text style={[styles.tabText]}>
                                {tabInfo.label}
                            </Text>
                        </Animated.View>
                        {/* <Animated.Text
                            style={[styles.tabText, { opacity: color }]}
                        >
                            {tabInfo.label}
                        </Animated.Text> */}
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Theme.backgroundColor,
    },
    fixedTab: {
        paddingTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingTab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        textAlign: 'center',
        color: Theme.darkForeground,
        fontFamily: Theme.regularFont,
        fontSize: 15,
    },
    activeTabText: {
        color: Theme.primaryColor,
    },
    icon: {
        color: Theme.darkForeground,
        marginBottom: 8,
    },
    activeIcon: {
        color: Theme.primaryColor,
    },
});

export default TabBar;
