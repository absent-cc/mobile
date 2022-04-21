import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';
import Theme from '../Theme';
import Anchor from './Anchor';

class ErrorBoundary extends React.Component {
    children: React.ReactNode;

    // eslint-disable-next-line react/state-in-constructor
    state: any;

    constructor(props: any) {
        super(props);
        this.children = props.children;
        this.state = {
            hasError: false,
            showing: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, showing: false, error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // could log errors here
        // eslint-disable-next-line no-console
        console.log('An error occurred', error, errorInfo);
    }

    showMore = () => {
        this.setState((oldState) => ({
            ...oldState,
            showing: true,
        }));
    };

    render() {
        const { hasError, showing, error } = this.state;

        if (hasError) {
            // You can render any custom fallback UI
            return (
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: Theme.backgroundColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 50,
                    }}
                >
                    <StatusBar style="dark" />
                    <Text
                        style={{
                            fontFamily: Theme.regularFont,
                            color: Theme.foregroundColor,
                            fontSize: 20,
                        }}
                    >
                        An unexpected error occurred. Sorry about that!{'\n'}Try
                        relaunching the app, and if that doesn't help, please{' '}
                        <Anchor href="https://absent.cc">
                            contact the developers
                        </Anchor>
                        !
                    </Text>
                    {showing ? (
                        <Text
                            style={{
                                marginTop: 10,
                                fontFamily: Theme.monospaceFont,
                                color: Theme.foregroundColor,
                                fontSize: 20,
                            }}
                        >
                            {error.toString()}
                        </Text>
                    ) : (
                        <Text
                            style={{
                                marginTop: 5,
                                fontFamily: Theme.regularFont,
                                color: Theme.foregroundColor,
                                fontSize: 20,
                                textDecorationLine: 'underline',
                            }}
                            onPress={this.showMore}
                        >
                            Show more
                        </Text>
                    )}
                </View>
            );
        }

        return this.children;
    }
}

export default ErrorBoundary;
