import React from 'react';
import { Path, Svg } from 'react-native-svg';
import Theme from '../../Theme';

function InverseWave({ style }: { style: any }) {
    return (
        <Svg style={style} viewBox="0 0 100 60" preserveAspectRatio="none">
            <Path
                fill={Theme.backgroundColor}
                d={`m 0 100 v -50 c 50 ${Theme.waveAmplitude * 100} 50 -${
                    Theme.waveAmplitude * 100
                } 100 0 l 0 50 z`}
            />
        </Svg>
    );
}

export default InverseWave;
