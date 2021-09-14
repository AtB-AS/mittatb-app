import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgInterchange(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M4.586 10.586a2 2 0 000 2.828l8 8 2.828-2.828L10.828 14H32v-4H10.828l4.586-4.586-2.828-2.828-8 8zM8 30h21.172l-4.586 4.586 2.828 2.828 8-8a2 2 0 000-2.828l-8-8-2.828 2.828L29.172 26H8v4z" />
    </Svg>
  );
}

export default SvgInterchange;
