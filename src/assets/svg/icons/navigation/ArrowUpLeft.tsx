import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgArrowUpLeft(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M24.828 11.515a2 2 0 01-2 2h-6.485L29.9 27.07a2 2 0 11-2.828 2.828L13.515 16.343v6.485a2 2 0 11-4 0V11.515a2 2 0 012-2h11.313a2 2 0 012 2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgArrowUpLeft;
