import * as React from 'react';
import Svg, {SvgProps, Path, Circle} from 'react-native-svg';

function SvgChatUnread(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M4 11a6 6 0 016-6h20a6 6 0 016 6v12a6 6 0 01-6 6h-3.172L20 35.828V29H10a6 6 0 01-6-6V11z" />
      <Circle cx={32} cy={9} r={6} fill="#A51140" />
    </Svg>
  );
}

export default SvgChatUnread;
