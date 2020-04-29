import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function MinusIcon(props: SvgProps) {
  return (
    <Svg width={12} height={2} viewBox="0 0 12 2" fill="black" {...props}>
      <Path d="M11.82 1.82H.18V.18h11.64v1.64z" fill="black" />
    </Svg>
  );
}

export default MinusIcon;
