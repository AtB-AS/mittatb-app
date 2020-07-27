import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgTickets(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 16 12" fill="black" {...props}>
      <Path
        fillRule="evenodd"
        d="M.5 0a.5.5 0 00-.5.5v3.576c0 .248.251.424.5.424a1.5 1.5 0 110 3c-.249 0-.5.176-.5.424V11.5a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V7.924c0-.248-.251-.424-.5-.424a1.5 1.5 0 010-3c.249 0 .5-.176.5-.424V.5a.5.5 0 00-.5-.5H.5zm7 4a.5.5 0 011 0v1.5H10a.5.5 0 010 1H8.5V8a.5.5 0 01-1 0V6.5H6a.5.5 0 010-1h1.5V4z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgTickets;
