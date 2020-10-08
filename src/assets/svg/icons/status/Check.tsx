import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgCheck(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M25.586 13.586L18 21.172l-3.586-3.586-2.828 2.828 5 5a2 2 0 002.828 0l9-9-2.828-2.828z" />
      <Path
        fillRule="evenodd"
        d="M20 2C10.059 2 2 10.059 2 20s8.059 18 18 18 18-8.059 18-18S29.941 2 20 2zM6 20c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14S6 27.732 6 20z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgCheck;
