import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgVipps(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M20.275 25.3c3.7 0 5.8-1.8 7.8-4.4 1.1-1.4 2.5-1.7 3.5-.9 1 .8 1.1 2.3 0 3.7-2.9 3.8-6.6 6.1-11.3 6.1-5.1 0-9.6-2.8-12.7-7.7-.9-1.3-.7-2.7.3-3.4 1-.7 2.5-.4 3.4 1 2.2 3.3 5.2 5.6 9 5.6zm6.9-12.3c0 1.8-1.4 3-3 3s-3-1.2-3-3 1.4-3 3-3 3 1.3 3 3z" />
    </Svg>
  );
}

export default SvgVipps;
