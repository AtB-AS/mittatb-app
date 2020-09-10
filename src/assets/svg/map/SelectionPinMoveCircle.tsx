import * as React from 'react';
import Svg, {Circle, SvgProps} from 'react-native-svg';

function SvgSelectionPinMoveCircle(props: SvgProps) {
  return (
    <Svg width={8} height={8} fill="none" viewBox="0 0 8 8" {...props}>
      <Circle cx={4} cy={4} r={4} fill="#fff" />
      <Circle cx={4} cy={4} r={2} fill="#000" />
    </Svg>
  );
}

export default SvgSelectionPinMoveCircle;
