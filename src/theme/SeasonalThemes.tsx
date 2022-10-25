import React from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { ThemeOption, Themes, ThemeType } from './Themes';

export enum EditableElement {
    Animation = 'Animation',
}

export interface SeasonalTheme {
    name: string;
    dateStart: {
        month: number;
        day: number;
    };
    dateEnd: {
        month: number;
        day: number;
    };
    themes: Record<ThemeOption, Partial<ThemeType>>;
    elements: Partial<
        Record<ThemeOption, Record<EditableElement, React.ReactNode>>
    >;
}

const styles = StyleSheet.create({
    animation: {
        height: 100,
        marginTop: 20,
        marginBottom: -10,
        width: '100%',
        maxWidth: 500,
    },
});

export const DefaultElements: Record<EditableElement, React.ReactNode> = {
    Animation: null,
};

export const SeasonalThemes: SeasonalTheme[] = [
    {
        name: 'Halloween',
        dateStart: {
            month: 10,
            day: 25,
        },
        dateEnd: {
            month: 11,
            day: 1,
        },
        themes: {
            Default: {
                ...Themes.Default,
                primaryColor: '#0000ff',
            },
            Dark: {
                ...Themes.Dark,
                primaryColor: '#0000ff',
            },
        },
        elements: {
            Default: {
                Animation: (
                    <Video
                        style={styles.animation}
                        // eslint-disable-next-line global-require, import/extensions
                        source={require('../../assets/video/halloween_anim_light.mp4')}
                        repeat
                        playWhenInactive
                        resizeMode="contain"
                    />
                ),
            },
            Dark: {
                Animation: (
                    <Video
                        style={styles.animation}
                        // eslint-disable-next-line global-require, import/extensions
                        source={require('../../assets/video/halloween_anim_dark.mp4')}
                        repeat
                        playWhenInactive
                        resizeMode="contain"
                    />
                ),
            },
        },
    },
];
