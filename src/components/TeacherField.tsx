import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    ScrollView,
    Keyboard,
    Platform,
    HostComponent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Theme from '../Theme';
import { useAPI } from '../api/APIContext';
import IconButton from './button/IconButton';

function TeacherField({
    defaultValue = '',
    onChange,
    style,
    deletable = false,
    onDelete = () => {
        // default
    },
    scrollRef,
}: {
    defaultValue?: string;
    onChange: (val: string) => void;
    style?: any;
    deletable?: boolean;
    onDelete?: () => void;
    scrollRef: React.MutableRefObject<ScrollView | null>;
}) {
    const changeFunc = React.useRef(onChange);

    // default text is teacher name or nothing
    const [currentTeacher, setCurrentTeacher] = React.useState(defaultValue);
    const [{ rawTextValue, trimmedTextValue }, setTextValue] = React.useState(
        () => ({
            rawTextValue: currentTeacher,
            trimmedTextValue: currentTeacher.trim(),
        }),
    );

    // teacher searching
    const [autocompleteIsOpen, setIsAutocompleteOpen] = React.useState(false);
    const { searchTeachers, isRealTeacher } = useAPI();
    const [teacherList, setTeacherList] = React.useState<string[]>([]);

    // make sure to only show suggestions after blur
    const [isActive, setIsActive] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<{
        isReal: boolean;
        similar: string[];
    } | null>(null);

    // debounced searching
    const throttledSearchInterval = 500; // ms
    const lastSearch = React.useRef(0);
    React.useEffect(() => {
        let isMounted = true;

        if (trimmedTextValue.length > 2) {
            const now = Date.now();
            if (now - lastSearch.current >= throttledSearchInterval) {
                searchTeachers(trimmedTextValue).then((searchTeacherList) => {
                    if (searchTeacherList && isMounted)
                        setTeacherList(searchTeacherList);
                });
                lastSearch.current = now;
            }
        }

        return () => {
            isMounted = false;
        };
    }, [trimmedTextValue, searchTeachers]);

    React.useEffect(() => {
        if (
            !isActive &&
            trimmedTextValue.length > 0 &&
            currentTeacher.length === 0
        ) {
            isRealTeacher(trimmedTextValue).then((result) => {
                if (!result) return;

                setSuggestions(result);
                if (result.isReal) {
                    setCurrentTeacher(result.similar[0]);
                    setTextValue({
                        rawTextValue: result.similar[0],
                        trimmedTextValue: result.similar[0],
                    });
                }
            });
        }
    }, [isActive, isRealTeacher, trimmedTextValue, currentTeacher.length]);

    // bubble up current teacher when it changes
    React.useEffect(() => {
        changeFunc.current(currentTeacher);
    }, [currentTeacher]);

    // functions
    const autocompleteOptionPress = (option: string) => {
        setTextValue({
            rawTextValue: option,
            trimmedTextValue: option,
        });
        setCurrentTeacher(option);
        setIsAutocompleteOpen(false);

        // assume autocomplete options are good
        setSuggestions(null);

        // dismiss the keyboard
        Keyboard.dismiss();
    };

    const onTextInput = (newValue: string) => {
        // set text input value, trimmed
        setTextValue({
            rawTextValue: newValue,
            trimmedTextValue: newValue.trim(),
        });
        // when text is input, it's like starting from scratch
        setCurrentTeacher('');
        setSuggestions(null);

        // open and close autocompleter
        if (!autocompleteIsOpen && newValue.length > 2) {
            setIsAutocompleteOpen(true);
        } else if (newValue.length <= 2) {
            setIsAutocompleteOpen(false);
            setTeacherList([]);
        }
    };

    const onFocus = () => {
        setIsActive(true);
        if (trimmedTextValue.length > 2) {
            setIsAutocompleteOpen(true);
        }

        // scroll
        if (scrollRef.current) {
            selfRef.current?.measureLayout(
                scrollRef.current as unknown as HostComponent<unknown>,
                (_, top) => {
                    scrollRef.current?.scrollTo({
                        y: Math.max(top - 200, 0),
                        animated: true,
                    });
                },
                () => undefined,
            );
        }
    };

    const onBlur = () => {
        setIsActive(false);
        setIsAutocompleteOpen(false);
    };

    const forceAdd = () => {
        setCurrentTeacher(trimmedTextValue);
        setSuggestions(null);
    };

    const suggestionPress = (option: string) => {
        setTextValue({
            rawTextValue: option,
            trimmedTextValue: option,
        });
        setCurrentTeacher(option);
        setSuggestions(null);
        setIsAutocompleteOpen(false);
    };

    // autocomplete list
    const autocompleteResults = React.useMemo(() => {
        const keylist: string[] = [];
        return teacherList.map((option, index) => {
            // avoid colliding teacher names
            let key = option;
            while (keylist.includes(key)) {
                key += '0';
            }
            keylist.push(key);

            return (
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
                        autocompleteOptionPress(option);
                    }}
                    key={key}
                >
                    <Text style={[styles.optionText]}>{option}</Text>
                </Pressable>
            );
        });
    }, [teacherList]);

    // suggestions
    const suggestionKeylist: string[] = [];
    const suggestionsElements = suggestions?.similar.map((suggestion) => {
        // avoid colliding teacher names
        let key = suggestion;
        while (suggestionKeylist.includes(key)) {
            key += '0';
        }
        suggestionKeylist.push(key);
        return (
            <Pressable
                style={({ pressed }) => [
                    styles.badTeacherOption,
                    styles.badTeacherKnown,
                    pressed ? styles.badTeacherKnownPressed : null,
                ]}
                onPress={() => {
                    suggestionPress(suggestion);
                }}
                key={key}
            >
                <Text style={styles.badTeacherOptionText}>{suggestion}</Text>
            </Pressable>
        );
    });

    // scrolling on focus
    const selfRef = React.useRef<View | null>(null);

    // ios autocomplete vertical offset
    const [inputHeight, setInputHeight] = React.useState(0);
    const onInputLayout = (event: any) => {
        setInputHeight(event.nativeEvent.layout.height);
    };

    return (
        <View style={[style]} ref={selfRef}>
            <View style={styles.inputContainer} onLayout={onInputLayout}>
                <TextInput
                    onChangeText={onTextInput}
                    placeholder="e.g. Rebecca Realson"
                    style={styles.input}
                    value={rawTextValue}
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

            {autocompleteIsOpen && teacherList.length > 0 ? (
                <View
                    style={[
                        styles.optionsListContainer,
                        { zIndex: 2 },
                        {
                            // offset IOS by 5 from input
                            top: inputHeight + 5,
                            // Platform.OS !== 'android' ? inputHeight + 5 : 0,
                        },
                    ]}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        // for android
                        nestedScrollEnabled
                    >
                        {autocompleteResults}
                    </ScrollView>
                </View>
            ) : null}

            {suggestions && !suggestions.isReal ? (
                <View style={[styles.badTeacher, { zIndex: 1 }]}>
                    <Feather
                        name="alert-triangle"
                        style={styles.badTeacherIcon}
                        size={40}
                    />
                    <View style={[styles.badTeacherContent]}>
                        <Text style={styles.badTeacherText}>
                            Please make sure that you entered your teacher’s
                            name correctly. “{trimmedTextValue}” is not a name
                            in our system.
                            {'\n'}
                            Did you mean:
                        </Text>
                        {suggestionsElements}

                        <Pressable
                            style={({ pressed }) => [
                                styles.badTeacherOption,
                                styles.badTeacherCustom,
                                pressed ? styles.badTeacherCustomPressed : null,
                            ]}
                            onPress={forceAdd}
                        >
                            <Text style={styles.badTeacherOptionText}>
                                Add “{trimmedTextValue}” to your schedule
                            </Text>
                        </Pressable>
                    </View>
                </View>
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
    optionText: {
        fontSize: 20,
        fontFamily: Theme.regularFont,
        color: Theme.foregroundColor,
    },
    withBorder: {
        borderBottomColor: Theme.lightForeground,
        borderBottomWidth: 2,
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
        backgroundColor: Theme.lighterForeground,
    },
});

export default TeacherField;
