import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function CloseModalCrossIcon(props: SvgProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="#000" {...props}>
      <Path d="M11.82 1.352L7.172 6l4.648 4.648-1.172 1.172L6 7.172 1.352 11.82.18 10.648 4.828 6 .18 1.352 1.352.18 6 4.828 10.648.18l1.172 1.172z" />
    </Svg>
  );
}

export default CloseModalCrossIcon;
