import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgWait(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path
        fill="#5F686E"
        fillRule="evenodd"
        d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-9a9 9 0 100 18 9 9 0 000-18zM9 5v5a1 1 0 001 1h5V9h-4V5H9z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgWait;
