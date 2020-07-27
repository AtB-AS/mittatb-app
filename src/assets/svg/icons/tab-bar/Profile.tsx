import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgProfile(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 16 16" fill="black" {...props}>
      <Path
        fillRule="evenodd"
        d="M8 8a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 014.443-7.168A5.973 5.973 0 008 10a5.973 5.973 0 003.557-1.168A8 8 0 0116 16H0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgProfile;
