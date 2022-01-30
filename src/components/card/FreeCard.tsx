import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Block } from '../../api/APITypes';
import Theme from '../../Theme';
import { BlockMapping } from '../../Utils';

function FreeCard({ blockId, style }: { blockId: Block; style?: any }) {
    return (
        <View style={[style, styles.container]}>
            <Text style={[styles.text, styles.block]}>
                {BlockMapping[blockId]}
            </Text>
            <Text style={[styles.text, styles.name]}>Free!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Theme.primaryColor,
        padding: 20,
        backgroundColor: Theme.freeBg,
    },
    text: {
        fontFamily: Theme.regularFont,
        fontSize: 20,
        color: Theme.foregroundColor,
    },
    block: {
        fontFamily: Theme.strongFont,
    },
    name: {
        position: 'absolute',
        left: 120,
        top: 20,
        right: 20,
    },
    time: {
        marginTop: 30,
    },
    note: { marginTop: 5 },
});

export default FreeCard;
