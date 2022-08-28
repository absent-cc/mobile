import { Feather } from '@expo/vector-icons';
// import { useRoute } from '@react-navigation/native';
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
    lightVersion = false,
}: {
    style?: any;
    close: () => void;
    message: string;
    caller: string;
    description: string;
    lightVersion?: boolean;
}) {
    const insets = useSafeAreaInsets();
    // const route = useRoute();
    // const lightVersion = ['Welcome', 'Loading'].includes(route.name);
    // const lightVersion = false;

    // Error logger
    // React.useEffect(() => {
    //     console.error(`${caller}: ${message}\n${description}`);
    // }, [caller, description, message]);

    const timeout = React.useRef<NodeJS.Timeout | null>(null);
    React.useEffect(() => {
        timeout.current = setTimeout(close, 5000);

        return () => {
            if (timeout.current) clearTimeout(timeout.current);
        };
    }, [close]);

    const [showing, setShowing] = React.useState(false);
    const showMore = () => {
        setShowing(true);
        if (timeout.current) clearTimeout(timeout.current);
    };

    return (
        <View
            style={[
                styles.container,
                lightVersion && styles.containerLight,
                { paddingBottom: insets.bottom + 40 },
                style,
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.close,
                    pressed ? styles.closePressed : undefined,
                    pressed && lightVersion && styles.closePressedLight,
                ]}
                onPress={close}
            >
                <Feather
                    style={[styles.icon, lightVersion && styles.iconLight]}
                    name="x"
                    size={24}
                />
            </Pressable>
            <Text
                style={[
                    styles.mainMessage,
                    lightVersion && styles.messageLight,
                ]}
            >
                {message}
            </Text>
            {showing ? (
                <>
                    <Text
                        style={[
                            styles.moreDetails,
                            lightVersion && styles.detailsLight,
                        ]}
                    >
                        Error occurred during {caller}.
                    </Text>
                    <Text
                        style={[
                            styles.description,
                            lightVersion && styles.detailsLight,
                        ]}
                    >
                        {description}
                    </Text>
                </>
            ) : (
                <Text
                    style={[styles.showMore, lightVersion && styles.moreLight]}
                    onPress={showMore}
                >
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
    containerLight: {
        backgroundColor: Theme.lighterForeground,
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
    closePressedLight: {
        backgroundColor: Theme.lightForeground,
    },
    icon: {
        color: Theme.foregroundAlternate,
    },
    iconLight: {
        color: Theme.primaryColor,
    },
    mainMessage: {
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
    },
    messageLight: {
        color: Theme.primaryColor,
    },
    showMore: {
        marginTop: 5,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    moreLight: {
        color: Theme.primaryColor,
    },
    moreDetails: {
        marginTop: 20,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
    },
    description: {
        marginTop: 10,
        fontFamily: Theme.monospaceFont,
        color: Theme.foregroundAlternate,
        fontSize: 20,
    },
    detailsLight: {
        color: Theme.primaryColor,
    },
});

export default ErrorDialog;
