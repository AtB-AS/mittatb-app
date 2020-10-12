import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAdjust(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M4 12h6.535a4 4 0 100-4H4v4zm0 10h18.535a4 4 0 100-4H4v4zm6.535 10H4v-4h6.535a4 4 0 110 4zM20 12h16V8H20v4zm16 10h-4v-4h4v4zM20 32h16v-4H20v4z" />
    </Svg>
  );
}

export default SvgAdjust;
