import React from 'react';
import { useColorScheme } from 'react-native';
import { ThemeOption, Themes, ThemeType } from './Themes';

export interface ThemeContextType {
    value: ThemeType;
    selection: ThemeOption | null;
    setTheme: React.Dispatch<React.SetStateAction<ThemeOption | null>>;
}

const ThemeContext = React.createContext<ThemeContextType>({
    value: Themes[ThemeOption.Default],
    selection: null,
    setTheme: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = React.useState<ThemeOption | null>(null);

    let effectiveTheme: ThemeOption;
    if (theme === null) {
        effectiveTheme =
            systemColorScheme === 'dark'
                ? ThemeOption.Dark
                : ThemeOption.Default;
    } else {
        effectiveTheme = theme;
    }

    const themeProp: ThemeContextType = React.useMemo(
        () => ({
            value: Themes[effectiveTheme],
            selection: theme,
            setTheme,
        }),
        [theme, effectiveTheme],
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
