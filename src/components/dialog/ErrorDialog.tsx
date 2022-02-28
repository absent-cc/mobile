import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Theme from '../../Theme';

function ErrorDialog({
    style,
    close,
    message,
    caller,
    description,
}: {
    style?: any;
    close: () => void;
    message: string;
    caller: string;
    description: string;
}) {
    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        console.error(`${caller}: ${message}\n${description}`);
    }, [caller, description, message]);

    React.useEffect(() => {
        const timeout = setTimeout(close, 8000);

        return () => clearTimeout(timeout);
    }, [close]);

    const [showing, setShowing] = React.useState(false);
    const showMore = () => {
        setShowing(true);
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
            <Text style={styles.mainMessage}>{message}</Text>
            {showing ? (
                <Text style={styles.moreDetails}>
                    Error occurred during {caller}.{'\n'}
                    {description}
                </Text>
            ) : (
                <Text style={styles.showMore} onPress={showMore}>
                    Show more
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Theme.primaryColor,
        padding: 40,
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
        backgroundColor: Theme.darkerPrimary,
    },
    icon: {
        color: Theme.foregroundAlternate,
    },
    mainMessage: {
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
    },
    showMore: {
        marginTop: 5,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    moreDetails: {
        marginTop: 20,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
    },
});

export default ErrorDialog;
