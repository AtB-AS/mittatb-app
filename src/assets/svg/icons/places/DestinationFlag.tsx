import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgDestinationFlag(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M10 8a1 1 0 00-1 1v22a1 1 0 001 1h2a1 1 0 001-1v-7h17.586c.89 0 1.337-1.077.707-1.707l-5.586-5.586a1 1 0 010-1.414l5.586-5.586c.63-.63.184-1.707-.707-1.707H10z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgDestinationFlag;
