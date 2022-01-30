import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '../Theme';
import TextButton from '../components/button/TextButton';
import { useAPI } from '../state/APIContext';

function Welcome({ navigation }: { navigation: any }) {
    const api = useAPI();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Theme.secondaryColor, Theme.primaryColor]}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.gradientBg}
            >
                <View style={styles.subarea}>
                    <Image
                        style={styles.logo}
                        // eslint-disable-next-line global-require, import/extensions
                        source={require('../assets/text_logo.png')}
                    />
                    <Text style={styles.subtitle}>
                        Cancelled classes at your fingertips.
                    </Text>
                </View>
                <View style={[styles.subarea, styles.ctaSubarea]}>
                    <Text style={styles.subtitle}>Sign in to get started.</Text>
                    <TextButton
                        onPress={() => {
                            api.login();
                            navigation.navigate('Onboarding');
                        }}
                        style={{ marginTop: 10 }}
                    >
                        Sign In
                    </TextButton>
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
        bottom: 150,
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
});

export default Welcome;
