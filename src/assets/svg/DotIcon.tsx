import React from 'react';
import Svg, {Circle, SvgProps} from 'react-native-svg';

function DotIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="#fff" {...props}>
      <Circle cx={10} cy={10} r={10} />
    </Svg>
  );
}

export default DotIcon;
