import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function CloseModalCrossIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.586 11.414a2 2 0 112.828-2.828L20 17.172l8.586-8.586a2 2 0 112.828 2.828L22.828 20l8.586 8.586a2 2 0 11-2.828 2.828L20 22.828l-8.586 8.586a2 2 0 11-2.828-2.828L17.172 20l-8.586-8.586z"
      />
    </Svg>
  );
}

export default CloseModalCrossIcon;
