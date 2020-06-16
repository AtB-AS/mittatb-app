import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgWarning(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M20 4l16 28H4L20 4zm-2 9a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-8zm1 11a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgWarning;
