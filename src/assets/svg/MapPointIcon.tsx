import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export default function MapPointIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 16c0 10.627-12 20-12 20S8 26.627 8 16C8 9.373 13.373 4 20 4s12 5.373 12 12zm-12 3a3 3 0 100-6 3 3 0 000 6z"
      />
    </Svg>
  );
}
