import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ChevronLeftIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M13.3516 13.8281L12.1797 15L7.17969 10L12.1797 5L13.3516 6.17187L9.52344 10L13.3516 13.8281Z" />
    </Svg>
  );
}

export default ChevronLeftIcon;
