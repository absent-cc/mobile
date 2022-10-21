import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

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
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: '100%',
                    minHeight: 150,
                    justifyContent: 'flex-end',
                },
                header: {
                    fontFamily: Theme.headerFont,
                    color: Theme.foregroundColor,
                    fontSize: 38,
                    marginTop: 50,
                    marginHorizontal: 30,
                    marginBottom: 20,
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
                    right: 20,
                    color: Theme.primaryColor,
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

    return (
        <View style={[style, styles.container]}>
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

export default Header;
