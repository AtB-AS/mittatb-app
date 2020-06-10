import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function HomeIcon(props: SvgProps) {
  return (
    <Svg width={30} height={25} viewBox="0 0 30 25" fill="#000" {...props}>
      <Path d="M12.145 24.355h-7.04V13H.855L15 .25 29.145 13h-4.25v11.355h-7.04v-8.5h-5.71v8.5z" />
    </Svg>
  );
}

export default HomeIcon;
