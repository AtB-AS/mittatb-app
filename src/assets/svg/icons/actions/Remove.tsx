import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgRemove(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path fillRule="evenodd" d="M36 22H4v-4h32v4z" clipRule="evenodd" />
    </Svg>
  );
}

export default SvgRemove;
