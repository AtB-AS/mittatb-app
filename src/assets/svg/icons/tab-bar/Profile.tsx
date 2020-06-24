import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgProfile(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path
        fillRule="evenodd"
        d="M10 10a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 014.443-7.168A5.973 5.973 0 0010 12a5.973 5.973 0 003.557-1.168A8 8 0 0118 18H2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgProfile;
