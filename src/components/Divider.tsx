import React from 'react';
import { View, StyleSheet } from 'react-native';
import Theme from '../Theme';

function Divider({ style }: { style?: any }) {
    return <View style={[style, styles.container]} />;
}

const styles = StyleSheet.create({
    container: {
        height: 2,
        width: '100%',
        // marginHorizontal: '5%',
        backgroundColor: Theme.lightForeground,
        marginVertical: 30,
        borderRadius: 1,
    },
});

export default Divider;
