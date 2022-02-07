import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../Theme';

function ErrorCard({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: any;
}) {
    return (
        <View style={[style, styles.container]}>
            <Feather name="alert-octagon" style={styles.icon} size={40} />
            <Text style={[styles.text]}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: Theme.primaryColor,
        marginRight: 20,
    },
    text: {
        fontFamily: Theme.strongFont,
        fontSize: 18,
        color: Theme.foregroundColor,
        flex: 1,
    },
});

export default ErrorCard;
