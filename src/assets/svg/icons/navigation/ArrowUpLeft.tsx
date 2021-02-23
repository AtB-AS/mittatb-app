import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgArrowUpLeft(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M10 8h14v4h-9.172l16.586 16.586-2.828 2.828L12 14.828V24H8V10a2 2 0 012-2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgArrowUpLeft;
