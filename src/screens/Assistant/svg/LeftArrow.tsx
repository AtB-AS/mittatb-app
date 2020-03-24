import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function LeftArrow(props: SvgProps) {
  return (
    <Svg width={7} height={10} viewBox="0 0 7 10" fill="#000" {...props}>
      <Path d="M6.852 1.172L3.023 5l3.829 3.828L5.68 10l-5-5 5-5 1.172 1.172z" />
    </Svg>
  );
}

export default LeftArrow;
