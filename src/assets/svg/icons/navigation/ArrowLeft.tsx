import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgArrowLeft(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M17.414 10.586a2 2 0 010 2.828L12.828 18H32a2 2 0 110 4H12.828l4.586 4.586a2 2 0 11-2.828 2.828l-8-8a2 2 0 010-2.828l8-8a2 2 0 012.828 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgArrowLeft;
