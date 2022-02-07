import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../Theme';
import { Teacher } from '../api/APITypes';
import { useAPI } from '../state/APIContext';
import IconButton from './button/IconButton';
import { joinName } from '../Utils';

function TeacherField({
    defaultValue = '',
    onChange,
    style,
    deletable = false,
    onDelete = () => {
        // default
    },
}: {
    defaultValue?: string;
    onChange: (val: string) => void;
    style?: any;
    deletable?: boolean;
    onDelete?: () => void;
}) {
    const changeFunc = React.useRef(onChange);

    // default text is teacher name or nothing
    const [currentTeacher, setCurrentTeacher] = React.useState(defaultValue);
    const [textValue, setTextValue] = React.useState(currentTeacher);

    const [autocompleteIsOpen, setIsAutocompleteOpen] = React.useState(false);

    // teacher searching
    const { searchTeachers, isRealTeacher } = useAPI();
    const [teacherList, setTeacherList] = React.useState<Teacher[]>([]);

    // make sure to only show suggestions after blur
    const [isActive, setIsActive] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<{
        isReal: boolean;
        similar: string[];
    } | null>(null);

    React.useEffect(() => {
        if (textValue.length > 0) {
            searchTeachers(textValue).then((searchTeacherList) => {
                setTeacherList(searchTeacherList);
            });
        }
    }, [textValue, searchTeachers]);

    React.useEffect(() => {
        if (!isActive && textValue.length > 0 && currentTeacher.length === 0) {
            isRealTeacher(textValue).then((result) => {
                setSuggestions(result);
                if (result.isReal) {
                    setCurrentTeacher(result.similar[0]);
                    setTextValue(result.similar[0]);
                }
            });
        }
    }, [isActive, isRealTeacher, textValue, currentTeacher.length]);

    // bubble up current teacher when it changes
    React.useEffect(() => {
        changeFunc.current(currentTeacher);
    }, [currentTeacher]);

    // functions
    const autocompleteOptionPress = (option: string) => {
        setTextValue(option);
        setCurrentTeacher(option);
        setIsAutocompleteOpen(false);

        // assume autocomplete options are good
        setSuggestions(null);
    };

    const onTextInput = (newValue: string) => {
        // set text input value
        setTextValue(newValue);
        // when text is input, it's like starting from scratch
        setCurrentTeacher('');
        setSuggestions(null);

        // open and close autocompleter
        if (!autocompleteIsOpen && newValue.length > 0) {
            setIsAutocompleteOpen(true);
        } else if (newValue.length === 0) {
            setIsAutocompleteOpen(false);
        }
    };

    const onFocus = () => {
        setIsActive(true);
        if (textValue.length > 0) {
            setIsAutocompleteOpen(true);
        }
    };

    const onBlur = () => {
        setIsActive(false);
        setIsAutocompleteOpen(false);
    };

    const forceAdd = () => {
        setCurrentTeacher(textValue);
        setSuggestions(null);
    };

    const suggestionPress = (option: string) => {
        setTextValue(option);
        setCurrentTeacher(option);
        setSuggestions(null);
    };

    return (
        <View style={style}>
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={onTextInput}
                    placeholder="e.g. Rebecca Realson"
                    style={styles.input}
                    value={textValue}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
                {deletable ? (
                    <IconButton
                        style={styles.teacherInputDelete}
                        onPress={onDelete}
                        iconName="trash-2"
                        isFilled
                    />
                ) : null}
            </View>
            {suggestions && !suggestions.isReal ? (
                <View style={styles.badTeacher}>
                    <Feather
                        name="alert-triangle"
                        style={styles.badTeacherIcon}
                        size={40}
                    />
                    <View style={[styles.badTeacherContent]}>
                        <Text style={styles.badTeacherText}>
                            Please make sure that you entered your teacher’s
                            name correctly. “{textValue}” is not a name in our
                            system.
                            {'\n'}
                            Did you mean:
                        </Text>
                        {
                            // suggestions
                            suggestions.similar.map((suggestion) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.badTeacherOption,
                                        styles.badTeacherKnown,
                                        pressed
                                            ? styles.badTeacherKnownPressed
                                            : null,
                                    ]}
                                    onPress={() => {
                                        suggestionPress(suggestion);
                                    }}
                                    key={suggestion}
                                >
                                    <Text style={styles.badTeacherOptionText}>
                                        {suggestion}
                                    </Text>
                                </Pressable>
                            ))
                        }

                        <Pressable
                            style={({ pressed }) => [
                                styles.badTeacherOption,
                                styles.badTeacherCustom,
                                pressed ? styles.badTeacherCustomPressed : null,
                            ]}
                            onPress={forceAdd}
                        >
                            <Text style={styles.badTeacherOptionText}>
                                Add “{textValue}” to the list
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ) : null}

            {autocompleteIsOpen && teacherList.length > 0 ? (
                <ScrollView style={styles.optionsList}>
                    {
                        // autocomplete list
                        teacherList.map((option, index) => (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.option,
                                    // last element has no border
                                    index === teacherList.length - 1
                                        ? null
                                        : styles.withBorder,
                                    pressed ? styles.optionPressed : undefined,
                                ]}
                                onPress={() => {
                                    autocompleteOptionPress(option.name);
                                }}
                                key={option.tid}
                            >
                                <Text style={[styles.optionText]}>
                                    {option.name}
                                </Text>
                            </Pressable>
                        ))
                    }
                </ScrollView>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    // input field and delete button
    input: {
        borderWidth: 2,
        borderColor: Theme.lightForeground,
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontSize: 20,
        fontFamily: Theme.regularFont,
        borderRadius: 50,

        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    teacherInputDelete: {
        flex: 0,
        marginLeft: 10,
    },
    // autocomplete
    optionsList: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Theme.lightForeground,
        position: 'absolute',
        top: 50,
        width: '100%',
        overflow: 'scroll',
        maxHeight: 200,
        backgroundColor: Theme.backgroundColor,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: Theme.backgroundColor,
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
    // bad teacher
    badTeacher: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 20,
    },
    badTeacherIcon: {
        color: Theme.warning,
        marginRight: 20,
    },
    badTeacherContent: {
        flex: 1,
    },
    badTeacherText: {
        color: Theme.foregroundColor,
        fontFamily: Theme.strongFont,
        fontSize: 16,
    },
    badTeacherOption: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontFamily: Theme.regularFont,
        borderRadius: 50,
        marginTop: 10,
    },
    badTeacherOptionText: {
        fontSize: 16,
    },
    badTeacherKnown: {
        backgroundColor: Theme.lighterForeground,
    },
    badTeacherKnownPressed: {
        backgroundColor: Theme.lightForeground,
    },
    badTeacherCustom: {
        borderColor: Theme.warning,
        borderWidth: 2,
    },
    badTeacherCustomPressed: {
        backgroundColor: Theme.lightForeground,
    },
});

export default TeacherField;
