import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ChevronDownIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M13.8281 7.14844L15 8.32031L10 13.3203L5 8.32031L6.17188 7.14844L10 10.9766L13.8281 7.14844Z" />
    </Svg>
  );
}

export default ChevronDownIcon;
