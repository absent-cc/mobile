import React from 'react';
import { StyleSheet, Image, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import { Feather } from '@expo/vector-icons';
import GoogleSignIn from '../components/button/GoogleSignIn';
import { useAPI } from '../api/APIContext';
import { useTheme } from '../theme/ThemeContext';

function Welcome({ navigation }: { navigation: any }) {
    const { value: Theme } = useTheme();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
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
                devButton: {
                    position: 'absolute',
                    borderRadius: 20,
                    backgroundColor: '#0006',
                    top: 50,
                    right: 20,
                    width: 60,
                    aspectRatio: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            }),
        [Theme],
    );

    const googleOptions = Constants.expoConfig?.extra?.isDevelopment
        ? {
              expoClientId:
                  '349911558418-rusr95n8ttq00iujmk3je4q5fmkiib5t.apps.googleusercontent.com',
              iosClientId:
                  '349911558418-6ps5ft9k690fva0ouc7popfbtr1s0l6a.apps.googleusercontent.com',
              androidClientId:
                  '349911558418-t8ld1clvadk0jg04rn3q86hms34h9js0.apps.googleusercontent.com',
          }
        : {
              expoClientId:
                  '349911558418-rusr95n8ttq00iujmk3je4q5fmkiib5t.apps.googleusercontent.com',
              iosClientId:
                  '349911558418-9tm5hh1jgk7k7obhcor3k9l3l2ejt3ue.apps.googleusercontent.com',
              androidClientId:
                  '349911558418-mjtpkjiuqfd5lcihfdi2kni73ja13ou5.apps.googleusercontent.com',
          };
    const [request, response, promptAsync] =
        Google.useIdTokenAuthRequest(googleOptions);
    const api = useAPI();

    React.useEffect(() => {
        if (response?.type === 'success' && response.params.id_token) {
            api.login(response.params.id_token);
        }
    }, [response, api]);

    return (
        <View style={styles.container}>
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
                    <Text style={styles.nps}>
                        Use your NPS Google account to get started.
                    </Text>
                    <GoogleSignIn
                        disabled={!request}
                        onPress={() => {
                            promptAsync();
                        }}
                        style={styles.button}
                    />
                </View>
                {Constants.expoConfig?.extra?.isDevelopment && (
                    <Pressable
                        style={styles.devButton}
                        onPress={() => {
                            navigation.navigate('DeveloperSettings');
                        }}
                    >
                        <Feather
                            style={{ color: '#eee' }}
                            name="terminal"
                            size={30}
                        />
                    </Pressable>
                )}
            </LinearGradient>
        </View>
    );
}

export default Welcome;
