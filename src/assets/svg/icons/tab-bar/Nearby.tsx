import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgNearby(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 14 14" fill="black" {...props}>
      <Path
        fillRule="evenodd"
        d="M14 7A7 7 0 110 7a7 7 0 0114 0zM7.5 2.5a.5.5 0 00-1 0V7a.5.5 0 00.5.5h4.5a.5.5 0 000-1h-4v-4z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgNearby;
