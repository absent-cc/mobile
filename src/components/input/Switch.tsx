import React from 'react';
import { StyleSheet, Text, View, Switch, Platform } from 'react-native';
import Theme from '../../Theme';

function SwitchField({
    label,
    defaultValue = false,
    style,
    onChange,
}: {
    label?: string;
    defaultValue?: boolean;
    style?: any;
    onChange: (val: boolean) => void;
}) {
    const [value, setValue] = React.useState(defaultValue);
    const changeFunc = (newValue: boolean) => {
        onChange(newValue);
        setValue(newValue);
    };

    const thumbColorOn =
        Platform.OS === 'android' ? Theme.darkerPrimary : Theme.backgroundColor;
    const thumbColorOff =
        Platform.OS === 'android'
            ? Theme.lightForeground
            : Theme.backgroundColor;
    const trackColorOn = Theme.primaryColor;
    const trackColorOff =
        Platform.OS === 'android'
            ? Theme.lighterForeground
            : Theme.lightForeground;

    return (
        <View style={[styles.container, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <Switch
                style={styles.switch}
                trackColor={{
                    false: trackColorOff,
                    true: trackColorOn,
                }}
                thumbColor={value ? thumbColorOn : thumbColorOff}
                ios_backgroundColor={Theme.lightForeground}
                onValueChange={changeFunc}
                value={value}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    switch: {
        flex: 0,
    },
    label: {
        fontFamily: Theme.strongFont,
        fontSize: 16,
        flex: 1,
        marginRight: 20,
    },
});

export default SwitchField;
