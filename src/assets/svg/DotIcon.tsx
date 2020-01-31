import React from 'react';
import Svg, {Circle, SvgProps} from 'react-native-svg';

function DotIcon(props: SvgProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="#fff" {...props}>
      <Circle cx={6} cy={6} r={6} />
    </Svg>
  );
}

export default DotIcon;
