import * as React from 'react';
import Svg, {SvgProps, Circle} from 'react-native-svg';

function SvgDot(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 21" {...props}>
      <Circle cx={10} cy={10} r={10} />
    </Svg>
  );
}

export default SvgDot;
