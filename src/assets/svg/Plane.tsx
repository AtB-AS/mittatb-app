import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function Plane(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="#000" {...props}>
      <Path d="M21 15.984L12.984 13.5v5.484l2.016 1.5v1.5L11.484 21l-3.468.984v-1.5l1.968-1.5V13.5l-7.968 2.484v-1.968L9.984 9V3.516c0-.407.141-.75.422-1.032.313-.312.672-.468 1.078-.468.407 0 .75.156 1.032.468.312.282.468.625.468 1.032V9L21 14.016v1.968z" />
    </Svg>
  );
}

export default Plane;
