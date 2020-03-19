import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function InfoIcon(props: SvgProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="#000" {...props}>
      <Path d="M9.82 6.5V4.82H8.18V6.5h1.64zm0 6.68v-5H8.18v5h1.64zM3.102 3.14C4.742 1.5 6.708.68 9 .68s4.245.82 5.86 2.46C16.5 4.756 17.32 6.709 17.32 9c0 2.292-.82 4.258-2.46 5.898-1.615 1.615-3.568 2.422-5.86 2.422-2.292 0-4.258-.807-5.898-2.422C1.487 13.258.68 11.292.68 9s.807-4.245 2.422-5.86z" />
    </Svg>
  );
}

export default InfoIcon;
