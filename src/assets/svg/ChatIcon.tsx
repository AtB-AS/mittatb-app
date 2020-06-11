import * as React from 'react';
import Svg, {Rect, Circle, Path, SvgProps} from 'react-native-svg';
import colors from '../../theme/colors';

function ChatIcon(props: SvgProps & {unreadCount: number}) {
  const {unreadCount, ...rest} = props;
  return (
    <Svg width={38} height={30} viewBox="0 0 38 30" fill="none" {...rest}>
      <Rect y={2} width={36} height={28} rx={8} fill={colors.secondary.cyan} />
      {unreadCount ? <Circle cx={32} cy={6} r={6} fill="#A51140" /> : null}
      <Path
        d="M18 15.5a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1h-6a1 1 0 01-1-1v-4zM12 17.5h2v2l-2-2zM22 20.5h2l-2 2v-2z"
        fill="#000"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 9.5a1 1 0 00-1 1v6a1 1 0 001 1h6v-2a2 2 0 012-2h3v-3a1 1 0 00-1-1H11z"
        fill="#000"
      />
    </Svg>
  );
}

export default ChatIcon;
