import { Feather } from '@expo/vector-icons';
import React from 'react';
import * as Updates from 'expo-updates';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';

function UpdateDialog({ style, close }: { style?: any; close: () => void }) {
    const insets = useSafeAreaInsets();

    // React.useEffect(() => {
    //     const timeout = setTimeout(close, 8000);

    //     return () => clearTimeout(timeout);
    // }, [close]);

    const [reloading, setReloading] = React.useState(false);
    React.useEffect(() => {
        if (reloading) {
            Updates.reloadAsync();
        }
    }, [reloading]);
    const onPress = () => {
        setReloading(true);
    };

    return (
        <View
            style={[
                styles.container,
                { paddingBottom: insets.bottom + 40 },
                style,
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.close,
                    pressed ? styles.closePressed : undefined,
                ]}
                onPress={close}
            >
                <Feather style={[styles.icon]} name="x" size={24} />
            </Pressable>
            <Text style={[styles.mainMessage]}>
                An update is available. Reload the app to use the new version.
            </Text>
            <Pressable
                style={({ pressed }) => [
                    style,
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
                onPress={onPress}
            >
                <Feather
                    style={[styles.buttonIcon]}
                    name="rotate-cw"
                    size={24}
                />
                <Text style={[styles.buttonText]}>Reload</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Theme.warning,
        padding: 40,
        paddingRight: 60,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,

        elevation: 5,
    },
    close: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    closePressed: {
        backgroundColor: Theme.darkerWarning,
    },
    icon: {
        color: Theme.foregroundColor,
    },
    mainMessage: {
        fontFamily: Theme.regularFont,
        color: Theme.foregroundColor,
        fontSize: 20,
    },
    button: {
        marginTop: 20,
        borderRadius: 50,
        width: '100%',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        backgroundColor: Theme.darkerWarning,
        borderColor: Theme.foregroundColor,
    },
    buttonPressed: {
        backgroundColor: Theme.warning,
    },
    buttonText: {
        fontSize: 20,
        fontFamily: Theme.strongFont,
        textAlign: 'center',
        color: Theme.foregroundColor,
    },
    buttonIcon: {
        marginRight: 8,
        color: Theme.foregroundColor,
    },
});

export default UpdateDialog;
