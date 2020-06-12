import * as React from 'react';
import Svg, {Path, Circle, SvgProps} from 'react-native-svg';

function SvgChatUnread(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M4 9a2 2 0 012-2h20a2 2 0 012 2v6h-6a4 4 0 00-4 4v4h-6v4l-4-4H6a2 2 0 01-2-2V9zm18 8a2 2 0 00-2 2v8a2 2 0 002 2h6v4l4-4h2a2 2 0 002-2v-8a2 2 0 00-2-2H22z"
        clipRule="evenodd"
      />
      <Circle cx={30} cy={10} r={6} fill="#A51140" />
    </Svg>
  );
}

export default SvgChatUnread;
