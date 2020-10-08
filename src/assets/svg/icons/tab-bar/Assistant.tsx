import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAssistant(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14c3.145 0 6.047-1.037 8.384-2.787l10.202 10.201 2.828-2.828-10.201-10.202A13.938 13.938 0 0030 16c0-7.732-6.268-14-14-14zM6 16c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S6 21.523 6 16z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgAssistant;
