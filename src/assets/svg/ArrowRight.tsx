import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ArrowRight(props: SvgProps) {
  return (
    <Svg width={6} height={6} viewBox="0 0 6 6" fill="#fff" {...props}>
      <Path d="M3 .328L5.672 3 3 5.672l-.469-.469 1.86-1.875H.328v-.656h4.063L2.53.797 3 .328z" />
    </Svg>
  );
}

export default ArrowRight;
