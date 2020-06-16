import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgNearby(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="#878E92" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M17 10a7 7 0 11-14 0 7 7 0 0114 0zm-6.5-4.5a.5.5 0 00-1 0V10a.5.5 0 00.5.5h4.5a.5.5 0 000-1h-4v-4z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgNearby;
