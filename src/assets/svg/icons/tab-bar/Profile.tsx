import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgProfile(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M10 1a4 4 0 100 8 4 4 0 000-8zM8 5a2 2 0 114 0 2 2 0 01-4 0z"
        clipRule="evenodd"
      />
      <Path d="M4 18a6 6 0 0112 0v1h2v-1a8 8 0 10-16 0v1h2v-1z" />
    </Svg>
  );
}

export default SvgProfile;
