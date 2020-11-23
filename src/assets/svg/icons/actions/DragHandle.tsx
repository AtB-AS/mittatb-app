import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgDragHandle(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path d="M4 9h12V7H4v2zm0 4h12v-2H4v2z" />
    </Svg>
  );
}

export default SvgDragHandle;
