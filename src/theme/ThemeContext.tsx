import React from 'react';
import { useColorScheme } from 'react-native';
import { isBetweenDates } from '../DateWordUtils';
import { useAppState } from '../state/AppStateContext';
import {
    DefaultElements,
    EditableElement,
    SeasonalThemes,
} from './SeasonalThemes';
import { ThemeOption, Themes, ThemeType } from './Themes';

export interface ThemeContextType {
    Theme: ThemeType;
    elements: Record<EditableElement, React.ReactNode>;
    message: string | null;
    selection: ThemeOption | null;
    setTheme: React.Dispatch<React.SetStateAction<ThemeOption | null>>;
    setAllowSeasonal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = React.createContext<ThemeContextType>({
    Theme: Themes[ThemeOption.Default],
    elements: DefaultElements,
    message: null,
    selection: null,
    setTheme: () => undefined,
    setAllowSeasonal: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { value: appState } = useAppState();
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = React.useState<ThemeOption | null>(null);
    const [allowSeasonal, setAllowSeasonal] = React.useState(true);

    let effectiveTheme: ThemeOption;
    if (theme === null) {
        effectiveTheme =
            systemColorScheme === 'dark'
                ? ThemeOption.Dark
                : ThemeOption.Default;
    } else {
        effectiveTheme = theme;
    }

    let finalElements = DefaultElements;
    let finalTheme = Themes[effectiveTheme];
    let message: string | null = null;

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

    if (allowSeasonal) {
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
        }
    }

    const themeProp: ThemeContextType = React.useMemo(
        () => ({
            Theme: finalTheme,
            elements: finalElements,
            message,
            selection: theme,
            setTheme,
            setAllowSeasonal,
        }),
        [theme, finalTheme, finalElements, message],
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
