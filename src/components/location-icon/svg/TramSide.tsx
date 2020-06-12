import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function TramSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path d="M5.88 28h28v-2h-28v2z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.644 24H7.116a2 2 0 01-1.789-1.106l-1.116-2.232a2 2 0 01-.151-1.38l1.442-5.767A2 2 0 017.442 12h24.877a2 2 0 011.94 1.515l1.442 5.767a2 2 0 01-.152 1.38l-1.116 2.232A2 2 0 0132.644 24zM29.88 14a1 1 0 00-1 1v2.323a1 1 0 00.629.928l2.555 1.023a1 1 0 001.342-1.171l-.836-3.346A1 1 0 0031.6 14h-1.72zm-19 1a1 1 0 00-1-1H8.161a1 1 0 00-.97.758l-.836 3.345a1 1 0 001.341 1.17l2.556-1.022a1 1 0 00.628-.928V15zm3-1a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1h-12z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.414 9a1 1 0 011-1h4a1 1 0 01.707 1.707l-4 4a1 1 0 01-1.414-1.414L20 10h-1.586a1 1 0 01-1-1z"
      />
    </Svg>
  );
}

export default TramSide;
