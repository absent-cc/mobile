import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import GoogleSignInIcon from './GoogleSignInIcon';

function GoogleSignIn({
    style,
    onPress,
    disabled,
}: {
    style?: any;
    onPress: () => void;
    disabled: boolean;
}) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                button: {
                    borderRadius: 50,
                    width: '100%',
                    paddingVertical: 8,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Theme.backgroundColor,
                    borderColor: Theme.primaryColor,
                    borderWidth: 2,
                },
                pressed: {
                    backgroundColor: Theme.lighterForeground,
                },
                text: {
                    flex: 1,
                    fontSize: 20,
                    fontFamily: Theme.strongFont,
                    textAlign: 'center',
                    color: Theme.primaryColor,
                },
                icon: {
                    marginRight: 24,
                    height: 24,
                    width: 24,
                },
            }),
        [Theme],
    );

    return (
        <Pressable
            style={({ pressed }) => [
                style,
                styles.button,
                pressed ? styles.pressed : null,
            ]}
            disabled={disabled}
            onPress={onPress}
        >
            <GoogleSignInIcon style={styles.icon} />
            <Text style={[styles.text]}>Sign In with Google</Text>
        </Pressable>
    );
}

export default GoogleSignIn;
