import * as React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

function DestinationIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path d="M9 9a1 1 0 011-1h20.586c.89 0 1.337 1.077.707 1.707l-5.586 5.586a1 1 0 000 1.414l5.586 5.586c.63.63.184 1.707-.707 1.707H10a1 1 0 01-1-1V9z" />
      <Rect x={9} y={20} width={4} height={12} rx={1} />
    </Svg>
  );
}

export default DestinationIcon;
