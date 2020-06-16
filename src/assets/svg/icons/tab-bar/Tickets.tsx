import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgTickets(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="#878E92" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M2.5 4a.5.5 0 00-.5.5v3.576c0 .248.251.424.5.424a1.5 1.5 0 110 3c-.249 0-.5.176-.5.424V15.5a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-3.576c0-.248-.251-.424-.5-.424a1.5 1.5 0 010-3c.249 0 .5-.176.5-.424V4.5a.5.5 0 00-.5-.5h-15zm7 4a.5.5 0 011 0v1.5H12a.5.5 0 010 1h-1.5V12a.5.5 0 01-1 0v-1.5H8a.5.5 0 010-1h1.5V8z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgTickets;
