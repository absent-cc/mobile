import React from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isBetweenDates } from '../DateWordUtils';
import { useAppState } from '../state/AppStateContext';
import {
    DefaultElements,
    EditableElement,
    SeasonalThemes,
} from './SeasonalThemes';
import { ThemeOption, Themes, ThemeType } from './Themes';
import { useDialog } from '../components/dialog/Dialog';
import ErrorDialog from '../components/dialog/ErrorDialog';

interface ThemeStateType {
    themeLoaded: boolean;
    theme: ThemeOption | null;
    allowSeasonal: boolean;
}
export interface ThemeContextType {
    Theme: ThemeType;
    elements: Record<EditableElement, React.ReactNode>;
    message: string | null;
    emoji: string | null;
    themeState: ThemeStateType;
    setThemeState: React.Dispatch<React.SetStateAction<ThemeStateType>>;
}

const ThemeContext = React.createContext<ThemeContextType>({
    Theme: Themes[ThemeOption.Default],
    elements: DefaultElements,
    message: null,
    emoji: null,
    themeState: {
        themeLoaded: false,
        theme: null,
        allowSeasonal: true,
    },
    setThemeState: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { value: appState } = useAppState();
    const { open: openDialog, close: closeDialog } = useDialog();
    const systemColorScheme = useColorScheme();
    const [themeState, setThemeState] = React.useState<ThemeStateType>({
        themeLoaded: false,
        theme: null,
        allowSeasonal: true,
    });

    // read token only once
    React.useEffect(() => {
        AsyncStorage.getItem('themesettings')
            .then((savedSettingsString) => {
                return savedSettingsString
                    ? JSON.parse(savedSettingsString)
                    : {};
            })
            .then((savedSettings) => {
                setThemeState((oldSettings) => ({
                    ...oldSettings,
                    ...savedSettings,
                    themeLoaded: true,
                }));
            })
            .catch(() => {
                setThemeState((oldSettings) => ({
                    ...oldSettings,
                    themeLoaded: true,
                }));
            });
    }, []);

    // save token on change
    React.useEffect(() => {
        if (themeState.themeLoaded) {
            const settingsString = JSON.stringify(themeState);
            AsyncStorage.setItem('themesettings', settingsString).catch((e) => {
                openDialog(
                    <ErrorDialog
                        message="An unknown error occurred while saving your theme settings."
                        description={e.message}
                        caller="Saving theme settings"
                        close={closeDialog}
                    />,
                );
            });
        }
    }, [themeState, openDialog, closeDialog]);

    let effectiveTheme: ThemeOption;
    if (themeState.theme === null) {
        effectiveTheme =
            systemColorScheme === 'dark'
                ? ThemeOption.Dark
                : ThemeOption.Default;
    } else {
        effectiveTheme = themeState.theme;
    }

    let finalElements = DefaultElements;
    let finalTheme = Themes[effectiveTheme];
    let message: string | null = null;
    let emoji: string | null = null;

    const currentMonth = appState.lastUpdateTime.getMonth() + 1;
    const currentDay = appState.lastUpdateTime.getDate();

    const seasonalTheme = React.useMemo(() => {
        const currentMonthDate = {
            month: currentMonth,
            day: currentDay,
        };

        return SeasonalThemes.find((comparingTheme) =>
            isBetweenDates(
                currentMonthDate,
                comparingTheme.dateStart,
                comparingTheme.dateEnd,
            ),
        );
    }, [currentDay, currentMonth]);

    if (themeState.allowSeasonal) {
        if (seasonalTheme) {
            finalTheme = {
                ...finalTheme,
                ...seasonalTheme.themes[effectiveTheme],
            };
            finalElements = {
                ...finalElements,
                ...seasonalTheme.elements[effectiveTheme],
            };
            message = seasonalTheme.message ?? null;
            emoji = seasonalTheme.emoji ?? null;
        }
    }

    const themeProp: ThemeContextType = React.useMemo(
        () => ({
            Theme: finalTheme,
            elements: finalElements,
            message,
            emoji,
            themeState,
            setThemeState,
        }),
        [themeState, finalTheme, finalElements, message, emoji],
    );

    return (
        <ThemeContext.Provider value={themeProp}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return React.useContext(ThemeContext);
}
