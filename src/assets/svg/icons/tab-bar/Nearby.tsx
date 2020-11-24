import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgNearby(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path d="M9 5v5a1 1 0 001 1h5V9h-4V5H9z" />
      <Path
        fillRule="evenodd"
        d="M10 1a9 9 0 100 18 9 9 0 000-18zm-7 9a7 7 0 1114 0 7 7 0 01-14 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgNearby;
