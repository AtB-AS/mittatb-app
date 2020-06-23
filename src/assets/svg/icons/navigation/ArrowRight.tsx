import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgArrowRight(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M22.586 10.586a2 2 0 000 2.828L27.172 18H8a2 2 0 100 4h19.172l-4.586 4.586a2 2 0 102.828 2.828l8-8a2 2 0 000-2.828l-8-8a2 2 0 00-2.828 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgArrowRight;
