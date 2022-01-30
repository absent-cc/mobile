import React from 'react';
import { Text, StyleSheet, Linking } from 'react-native';

function Anchor({
    style,
    children,
    href = '',
}: {
    style?: any;
    children?: any;
    href?: string;
}) {
    const onPress = () => {
        Linking.openURL(href);
    };
    return (
        <Text style={[styles.container, style]} onPress={onPress}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    container: {
        textDecorationLine: 'underline',
    },
});

export default Anchor;
