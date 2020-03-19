import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function RightArrow(props: SvgProps) {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44" fill="#000" {...props}>
      <Path d="M20.32 17l5 5-5 5-1.172-1.172L22.977 22l-3.829-3.828L20.32 17z" />
    </Svg>
  );
}

export default RightArrow;
