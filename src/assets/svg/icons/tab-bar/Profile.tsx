import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgProfile(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M20 2a8 8 0 100 16 8 8 0 000-16zm-4 8a4 4 0 118 0 4 4 0 01-8 0z"
        clipRule="evenodd"
      />
      <Path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12v2h4v-2c0-8.837-7.163-16-16-16S4 27.163 4 36v2h4v-2z" />
    </Svg>
  );
}

export default SvgProfile;
