import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgSwap(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M29.414 4.586a2 2 0 00-2.828 0l-8 8 2.828 2.828L26 10.828V32h4V10.828l4.586 4.586 2.828-2.828-8-8zM10 8v21.172l-4.586-4.586-2.828 2.828 8 8a2 2 0 002.828 0l8-8-2.828-2.828L14 29.172V8h-4z" />
    </Svg>
  );
}

export default SvgSwap;
