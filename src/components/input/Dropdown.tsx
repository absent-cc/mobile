import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    ScrollView,
    Platform,
} from 'react-native';
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

    const [inputHeight, setInputHeight] = React.useState(0);
    const onInputLayout = (event: any) => {
        setInputHeight(event.nativeEvent.layout.height);
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
                key={option}
            >
                <Text style={[styles.optionText]}>{option}</Text>
            </Pressable>,
        );
    });

    return (
        <View style={[style]} onLayout={onInputLayout}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={styles.inputFieldContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.input,
                        pressed ? styles.inputPressed : null,
                    ]}
                    onPress={toggleMenu}
                >
                    {value === -1 ? (
                        <Text style={styles.placeholder}>
                            {placeholder || ' '}
                        </Text>
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
            </View>
            {isOpen ? (
                <View
                    style={[
                        styles.optionsListContainer,
                        {
                            // offset IOS by 5 from input
                            top: inputHeight + 5,
                            // Platform.OS !== 'android' ? inputHeight + 5 : 0,
                        },
                    ]}
                >
                    <ScrollView>{elements}</ScrollView>
                </View>
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
        backgroundColor: Theme.backgroundColor,
    },
    inputPressed: {
        backgroundColor: Theme.lighterForeground,
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
        position: 'relative',
        marginLeft: -42,
        marginTop: 2,
    },
    inputFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsListContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Theme.lightForeground,
        maxHeight: 200,
        position: 'absolute',
        // ...Platform.select({
        //     ios: {
        //         position: 'absolute',
        //         // borderWidth: 2,
        //         // borderColor: Theme.lightForeground,
        //     },
        //     android: {
        //         position: 'relative',
        //         marginTop: 5,
        //     },
        // }),
        width: '100%',
        backgroundColor: Theme.backgroundColor,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: Theme.backgroundColor,
        position: 'relative',
    },
    optionPressed: {
        backgroundColor: Theme.lighterForeground,
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
});

export default Dropdown;
