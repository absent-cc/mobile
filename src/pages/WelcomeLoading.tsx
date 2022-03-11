import React from 'react';
import { StyleSheet, Image, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../Theme';

function WelcomeLoading() {
    return (
        <View style={styles.container}>
            {/* <StatusBar style="light" /> */}
            <LinearGradient
                colors={[
                    Theme.secondaryColor,
                    Theme.primaryColor,
                    Theme.tertiaryColor,
                ]}
                locations={[0, 0.5, 1]}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.gradientBg}
            >
                <View
                    style={[
                        styles.subarea,
                        {
                            // position: 'absolute',
                            // top: 300,
                        },
                    ]}
                >
                    <Image
                        style={styles.logo}
                        // eslint-disable-next-line global-require, import/extensions
                        source={require('../../assets/images/text_logo.png')}
                    />
                    <Text style={styles.subtitle}>
                        Cancelled classes at your fingertips.
                    </Text>
                </View>
                <View style={[styles.subarea, styles.ctaSubarea]}>
                    <ActivityIndicator
                        size="large"
                        color={Theme.foregroundAlternate}
                    />
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    gradientBg: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subarea: {
        width: 300,
    },
    ctaSubarea: {
        position: 'absolute',
        bottom: 120,
    },
    logo: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
    },
    subtitle: {
        color: Theme.foregroundAlternate,
        fontFamily: Theme.strongFont,
        fontSize: 20,
        textAlign: 'center',
    },
    button: {
        marginTop: 15,
    },
    nps: {
        color: Theme.foregroundAlternate,
        fontFamily: Theme.regularFont,
        fontSize: 20,
        textAlign: 'center',
    },
});

export default WelcomeLoading;
