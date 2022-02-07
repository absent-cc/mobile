import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../../Theme';

function Dropdown({
    label,
    defaultValue = -1,
    placeholder = '',
    style,
    onChange,
    options,
}: {
    label?: string;
    defaultValue?: number;
    placeholder?: string;
    style?: any;
    onChange: (val: number) => void;
    options: any[];
}) {
    const [value, setValue] = React.useState(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const optionPress = (index: number) => {
        onChange(index);
        setValue(index);
        setIsOpen(false);
    };

    const elements: any[] = [];
    options.forEach((option, index) => {
        elements.push(
            <Pressable
                style={({ pressed }) => [
                    styles.option,
                    index === value ? styles.optionSelected : null,
                    index === options.length - 1 ? null : styles.withBorder,
                    pressed ? styles.optionPressed : undefined,
                ]}
                onPress={() => {
                    optionPress(index);
                }}
                key={index.toString()}
            >
                <Text style={[styles.optionText]}>{option}</Text>
            </Pressable>,
        );
    });

    return (
        <View style={style}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <Pressable style={[styles.input]} onPress={toggleMenu}>
                {value === -1 ? (
                    <Text style={styles.placeholder}>{placeholder || ' '}</Text>
                ) : (
                    <Text style={styles.inputText}>{options[value]}</Text>
                )}
            </Pressable>
            <Feather
                onPress={toggleMenu}
                name="chevron-down"
                size={30}
                style={styles.button}
            />
            {isOpen ? (
                <ScrollView style={styles.optionsList}>{elements}</ScrollView>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 2,
        borderColor: Theme.lightForeground,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 50,
        width: '100%',
    },
    inputText: {
        fontSize: 20,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundColor,
    },
    placeholder: {
        fontSize: 20,
        fontFamily: Theme.regularFont,
        color: Theme.lightForeground,
    },
    label: {
        fontFamily: Theme.strongFont,
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
    },
    button: {
        color: Theme.lightForeground,
        position: 'absolute',
        right: 12,
        bottom: 7,
    },
    optionsList: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Theme.lightForeground,
        position: 'absolute',
        top: 75,
        width: '100%',
        overflow: 'scroll',
        maxHeight: 200,
        backgroundColor: Theme.backgroundColor,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: Theme.backgroundColor,
        position: 'relative',
    },
    optionSelected: {
        backgroundColor: Theme.lightForeground,
    },
    optionText: {
        fontSize: 20,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundColor,
    },
    withBorder: {
        borderBottomColor: Theme.lightForeground,
        borderBottomWidth: 2,
    },
    optionPressed: {
        backgroundColor: Theme.lightForeground,
    },
});

export default Dropdown;
