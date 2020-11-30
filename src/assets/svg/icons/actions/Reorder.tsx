import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgReorder(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path d="M14.707 4.293a1 1 0 00-1.414 0l-3 3 1.414 1.414L13 7.414v5.172l-1.293-1.293-1.414 1.414 3 3a1 1 0 001.414 0l3-3-1.414-1.414L15 12.586V7.414l1.293 1.293 1.414-1.414-3-3zM2 7h7V5H2v2zm0 4h7V9H2v2zm7 4H2v-2h7v2z" />
    </Svg>
  );
}

export default SvgReorder;
