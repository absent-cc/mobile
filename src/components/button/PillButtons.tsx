import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

function PillButtons({
    buttons,
    defaultValue = 0,
    onPress,
}: {
    buttons: { text: string }[];
    defaultValue?: number;
    onPress: (index: number) => void;
}) {
    const [active, setActive] = React.useState(defaultValue);

    const { Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: 'row',
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: Theme.primaryColor,
                    overflow: 'hidden',
                },
                base: {
                    flex: 1,
                    padding: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                active: {
                    backgroundColor: Theme.primaryColor,
                },
                inactive: {
                    backgroundColor: Theme.backgroundColor,
                },
                pressedActive: {
                    backgroundColor: Theme.darkerPrimary,
                },
                pressedInactive: {
                    backgroundColor: Theme.lighterForeground,
                },

                text: {
                    fontSize: 20,
                    fontFamily: Theme.strongFont,
                    textAlign: 'center',
                },
                activeText: {
                    color: Theme.foregroundAlternate,
                },
                inactiveText: {
                    color: Theme.primaryColor,
                },
            }),
        [Theme],
    );

    return (
        <View style={styles.container}>
            {buttons.map((button, index) => (
                <Pressable
                    style={({ pressed }) => [
                        styles.base,
                        active === index ? styles.active : styles.inactive,
                        // eslint-disable-next-line no-nested-ternary
                        pressed
                            ? active === index
                                ? styles.pressedActive
                                : styles.pressedInactive
                            : null,
                    ]}
                    onPress={() => {
                        onPress(index);
                        setActive(index);
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                >
                    <Text
                        style={[
                            styles.text,
                            active === index
                                ? styles.activeText
                                : styles.inactiveText,
                        ]}
                    >
                        {button.text}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

export default PillButtons;
