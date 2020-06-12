import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgPlaneSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} {...props}>
      <Path fill="none" d="M0 0h24v24H0V0z" />
      <Path d="M20.5 19h-17c-.55 0-1 .45-1 1s.45 1 1 1h17c.55 0 1-.45 1-1s-.45-1-1-1zm1.57-9.36c-.22-.8-1.04-1.27-1.84-1.06L14.92 10 8.46 3.98a1.06 1.06 0 00-1.02-.25c-.68.19-1 .97-.65 1.58l3.44 5.96-4.97 1.33-1.57-1.24c-.25-.19-.57-.26-.88-.18l-.33.09c-.32.08-.47.45-.3.73l1.88 3.25c.23.39.69.58 1.12.47L21 11.48c.8-.22 1.28-1.04 1.07-1.84z" />
    </Svg>
  );
}

export default SvgPlaneSide;
