import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgInfo(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        fill="#007C92"
        fillOpacity={0.25}
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
      />
      <Path
        fill="#007C92"
        fillRule="evenodd"
        d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0z"
        clipRule="evenodd"
      />
      <Path fill="#000" d="M11 6H9v2h2V6zM9 9v5h2V9H9z" />
    </Svg>
  );
}

export default SvgInfo;
