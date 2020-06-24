import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgCheck(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M34.414 10.586a2 2 0 010 2.828l-16 16a2 2 0 01-2.828 0l-8-8a2 2 0 112.828-2.828L17 25.172l14.586-14.586a2 2 0 012.828 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgCheck;
