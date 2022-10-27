import React from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { ThemeOption, ThemeType } from './Themes';

export enum EditableElement {
    Animation = 'Animation',
}

export interface SeasonalTheme {
    name: string;
    message?: string;
    emoji?: string;
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
        name: 'Prehalloween',
        emoji: '🦇',
        dateStart: {
            month: 10,
            day: 26,
        },
        dateEnd: {
            month: 10,
            day: 31,
        },
        themes: {
            Default: {
                primaryColor: '#9847b3',
                secondaryColor: '#ff5e19',
                tertiaryColor: '#431c52',
                darkerPrimary: '#6c3380',
            },
            Dark: {
                primaryColor: '#9847b3',
                secondaryColor: '#ff5e19',
                tertiaryColor: '#431c52',
                darkerPrimary: '#6c3380',
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
                        ignoreSilentSwitch="obey"
                        disableFocus
                        muted
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
                        ignoreSilentSwitch="obey"
                        disableFocus
                        muted
                    />
                ),
            },
        },
    },
    {
        name: 'Halloween',
        message: 'Happy Halloween!',
        emoji: '🍬',
        dateStart: {
            month: 10,
            day: 31,
        },
        dateEnd: {
            month: 11,
            day: 1,
        },
        themes: {
            Default: {
                primaryColor: '#9847b3',
                secondaryColor: '#ff5e19',
                tertiaryColor: '#431c52',
                darkerPrimary: '#6c3380',
            },
            Dark: {
                primaryColor: '#9847b3',
                secondaryColor: '#ff5e19',
                tertiaryColor: '#431c52',
                darkerPrimary: '#6c3380',
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
                        ignoreSilentSwitch="obey"
                        disableFocus
                        muted
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
                        ignoreSilentSwitch="obey"
                        disableFocus
                        muted
                    />
                ),
            },
        },
    },
    {
        name: 'Posthalloween',
        emoji: '🍂',
        dateStart: {
            month: 11,
            day: 1,
        },
        dateEnd: {
            month: 11,
            day: 5,
        },
        themes: {
            Default: {
                primaryColor: '#9847b3',
                secondaryColor: '#ff5e19',
                tertiaryColor: '#431c52',
                darkerPrimary: '#6c3380',
            },
            Dark: {
                primaryColor: '#9847b3',
                secondaryColor: '#ff5e19',
                tertiaryColor: '#431c52',
                darkerPrimary: '#6c3380',
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
                        ignoreSilentSwitch="obey"
                        disableFocus
                        muted
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
                        ignoreSilentSwitch="obey"
                        disableFocus
                        muted
                    />
                ),
            },
        },
    },
];
