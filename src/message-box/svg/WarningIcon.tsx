import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function WarningIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M10.8203 11.6797V8.32031H9.17969V11.6797H10.8203ZM10.8203 15V13.3203H9.17969V15H10.8203ZM0.820312 17.5L10 1.67969L19.1797 17.5H0.820312Z" />
    </Svg>
  );
}

export default WarningIcon;
