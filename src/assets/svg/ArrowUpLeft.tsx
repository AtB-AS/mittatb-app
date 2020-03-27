import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ArrowUpLeft(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="black" {...props}>
      <Path d="M19 17.59L17.59 19 7 8.41V15H5V5h10v2H8.41L19 17.59z" />
    </Svg>
  );
}

export default ArrowUpLeft;
