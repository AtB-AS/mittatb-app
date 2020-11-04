import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgCalendar(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 16 16" {...props}>
      <Path d="M13.25 13.25H2.75V7.125h10.5v6.125zm.875-10.5h-1.75v-.875c0-.525-.35-.875-.875-.875h-.875c-.525 0-.875.35-.875.875v.875h-3.5v-.875C6.25 1.35 5.9 1 5.375 1H4.5c-.525 0-.875.35-.875.875v.875h-1.75C1.35 2.75 1 3.1 1 3.625v10.5c0 .525.35.875.875.875h12.25c.525 0 .875-.35.875-.875v-10.5c0-.525-.35-.875-.875-.875z" />
    </Svg>
  );
}

export default SvgCalendar;
