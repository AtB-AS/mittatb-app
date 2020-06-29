import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAdd(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M20 4a2 2 0 00-2 2v12H6a2 2 0 100 4h12v12a2 2 0 104 0V22h12a2 2 0 100-4H22V6a2 2 0 00-2-2z" />
    </Svg>
  );
}

export default SvgAdd;
