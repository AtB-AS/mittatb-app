import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgDestinationFlag(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M8 6a2 2 0 012-2h22a2 2 0 011.414 3.414L26.828 14l6.586 6.586A2 2 0 0132 24H12v12H8V6zm4 14h15.172l-4.586-4.586a2 2 0 010-2.828L27.172 8H12v12z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgDestinationFlag;
