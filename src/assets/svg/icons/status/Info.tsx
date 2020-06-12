import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgInfo(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M34 20c0 7.732-6.268 14-14 14S6 27.732 6 20 12.268 6 20 6s14 6.268 14 14zm-16-1a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-8zm1-7a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgInfo;
