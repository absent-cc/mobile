export interface ThemeType {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    backgroundColor: string;
    foregroundColor: string;
    foregroundAlternate: string;
    regularFont: string;
    strongFont: string;
    headerFont: string;
    monospaceFont: string;
    italicFont: string;
    waveAmplitude: number;
    lighterForeground: string;
    lightForeground: string;
    darkForeground: string;
    foregroundAlternateDarker: string;
    warning: string;
    darkerWarning: string;
    darkerPrimary: string;
}

export enum ThemeOption {
    Default = 'Default',
    Dark = 'Dark',
}

export const ThemeList = [null, ThemeOption.Default, ThemeOption.Dark];

export const Themes: Record<ThemeOption, ThemeType> = {
    Default: {
        primaryColor: '#EF4344',
        secondaryColor: '#FF793F',
        tertiaryColor: '#DA2123',
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000',
        foregroundAlternate: '#FFFFFF',
        lighterForeground: '#EEEEEE',
        lightForeground: '#CCCCCC',
        darkForeground: '#666',
        warning: '#F9AF40',
        darkerWarning: '#f89c12',
        darkerPrimary: '#bc1010',
        foregroundAlternateDarker: '#EEEEEE',
        regularFont: 'Inter_400Regular',
        strongFont: 'Inter_600SemiBold',
        headerFont: 'Inter_Display_600SemiBold',
        monospaceFont: 'RobotoMono_400Regular',
        italicFont: 'Inter_400Regular_Italic',
        waveAmplitude: 0.2,
    },
    Dark: {
        primaryColor: '#EF4344',
        secondaryColor: '#FF793F',
        tertiaryColor: '#DA2123',
        backgroundColor: '#000000',
        foregroundColor: '#FFFFFF',
        foregroundAlternate: '#FFFFFF',
        lighterForeground: '#333333',
        lightForeground: '#666666',
        darkForeground: '#CCCCCC',
        warning: '#F9AF40',
        darkerWarning: '#f89c12',
        darkerPrimary: '#bc1010',
        foregroundAlternateDarker: '#EEEEEE',
        regularFont: 'Inter_400Regular',
        strongFont: 'Inter_600SemiBold',
        headerFont: 'Inter_Display_600SemiBold',
        monospaceFont: 'RobotoMono_400Regular',
        italicFont: 'Inter_400Regular_Italic',
        waveAmplitude: 0.2,
    },
};
