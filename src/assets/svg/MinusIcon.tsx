import React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

function MinusIcon(props: SvgProps) {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="#000" {...props}>
      <Rect x={4} y={18} width={32} height={4} rx={2} />
    </Svg>
  );
}

export default MinusIcon;
