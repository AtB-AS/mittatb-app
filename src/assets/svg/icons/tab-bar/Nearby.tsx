import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgNearby(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M18 10v10a2 2 0 002 2h10v-4h-8v-8h-4z" />
      <Path
        fillRule="evenodd"
        d="M20 2C10.059 2 2 10.059 2 20s8.059 18 18 18 18-8.059 18-18S29.941 2 20 2zM6 20c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14S6 27.732 6 20z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgNearby;
