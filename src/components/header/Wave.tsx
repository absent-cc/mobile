import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import Theme from '../../Theme';

function Wave({ style }: { style: any }) {
    return (
        <Svg style={style} viewBox="0 0 100 60" preserveAspectRatio="none">
            <Defs>
                <LinearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop
                        offset="0"
                        stopColor={Theme.secondaryColor}
                        stopOpacity="1"
                    />
                    <Stop
                        offset="0.5"
                        stopColor={Theme.primaryColor}
                        stopOpacity="1"
                    />
                    <Stop
                        offset="1"
                        stopColor={Theme.tertiaryColor}
                        stopOpacity="1"
                    />
                </LinearGradient>
            </Defs>
            <Path
                fill="url(#waveGrad)"
                d={`m 0 0 v 50 c 50 ${Theme.waveAmplitude * 100} 50 -${
                    Theme.waveAmplitude * 100
                } 100 0 l 0 -50 z`}
            />
        </Svg>
    );
}

export default Wave;
