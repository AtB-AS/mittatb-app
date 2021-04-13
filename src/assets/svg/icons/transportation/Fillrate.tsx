import Svg, {Color, Path, SvgProps} from 'react-native-svg';
import React from 'react';
import {Theme, useTheme} from '@atb/theme';

type SvgFillRateProps = {
  fillColor: string;
  size?: keyof Theme['icon']['size'];
} & SvgProps;

function SvgFillrate({fillColor, size = 'normal', ...props}: SvgFillRateProps) {
  const {theme} = useTheme();
  const colorString: string = fillColor;
  const height = theme.icon.size[size];
  const width = theme.icon.size[size];

  return (
    <Svg width={width} height={height} viewBox="0 -1 5 12" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 0.5C2.89543 0.5 2 1.39543 2 2.5C2 3.60457 2.89543 4.5 4 4.5C5.10457 4.5 6 3.60457 6 2.5C6 1.39543 5.10457 0.5 4 0.5Z"
        fill={colorString}
      />
      <Path
        d="M8 9.5V9C8 6.79086 6.20914 5 4 5C1.79086 5 0 6.79086 0 9V9.5H8Z"
        fill={colorString}
      />
    </Svg>
  );
}

export default SvgFillrate;
