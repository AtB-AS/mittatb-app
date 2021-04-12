import Svg, {Path, SvgProps} from 'react-native-svg';
import React from 'react';

function SvgFillrate(props: SvgProps) {
  return (
    <Svg width="8" height="10" viewBox="0 0 8 10" fill="#888" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 0.5C2.89543 0.5 2 1.39543 2 2.5C2 3.60457 2.89543 4.5 4 4.5C5.10457 4.5 6 3.60457 6 2.5C6 1.39543 5.10457 0.5 4 0.5Z"
        fill="#007C92"
      />
      <Path
        d="M8 9.5V9C8 6.79086 6.20914 5 4 5C1.79086 5 0 6.79086 0 9V9.5H8Z"
        fill="#007C92"
      />
    </Svg>
  );
}

export default SvgFillrate;
