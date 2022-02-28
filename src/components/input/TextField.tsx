import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../Theme';

function TextField({
    label,
    defaultValue = '',
    placeholder = '',
    style,
    onChange,
    isNumber = false,
}: {
    label?: string;
    defaultValue?: string;
    placeholder?: string;
    style?: any;
    onChange: (val: string) => void;
    isNumber?: boolean;
}) {
    const [value, setValue] = React.useState(defaultValue);
    const changeFunc = (newValue: string) => {
        onChange(newValue);
        setValue(newValue);
    };
    const clear = () => {
        changeFunc('');
    };

    return (
        <View style={style}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={styles.inputFieldContainer}>
                <TextInput
                    style={[styles.input]}
                    onChangeText={changeFunc}
                    value={value}
                    placeholder={placeholder}
                    keyboardType={isNumber ? 'numeric' : 'default'}
                />
                <Feather
                    onPress={clear}
                    name="x"
                    size={30}
                    style={styles.clear}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 2,
        borderColor: Theme.lightForeground,
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontSize: 20,
        fontFamily: Theme.regularFont,
        borderRadius: 50,
        width: '100%',
    },
    label: {
        fontFamily: Theme.strongFont,
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
    },
    clear: {
        color: Theme.lightForeground,
        marginLeft: -42,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default TextField;
