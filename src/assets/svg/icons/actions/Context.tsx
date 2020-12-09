import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgContext(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M24 20a4 4 0 11-8 0 4 4 0 018 0zm12 0a4 4 0 11-8 0 4 4 0 018 0zm-24 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </Svg>
  );
}

export default SvgContext;
