import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgCreditCard(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M2 12a6 6 0 016-6h24a6 6 0 016 6v16a6 6 0 01-6 6H8a6 6 0 01-6-6V12zm6-2a2 2 0 00-2 2v6h28v-6a2 2 0 00-2-2H8zm26 16H6v2a2 2 0 002 2h24a2 2 0 002-2v-2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgCreditCard;
