import * as React from 'react';
import Svg, {Rect, SvgProps} from 'react-native-svg';

function SvgRemove(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="black" {...props}>
      <Rect width={32} height={4} x={4} y={18} rx={2} />
    </Svg>
  );
}

export default SvgRemove;
