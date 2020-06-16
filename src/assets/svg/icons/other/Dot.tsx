import * as React from 'react';
import Svg, {Circle, SvgProps} from 'react-native-svg';

function SvgDot(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 21" {...props}>
      <Circle cx={10} cy={10} r={10} fill="#fff" />
    </Svg>
  );
}

export default SvgDot;
