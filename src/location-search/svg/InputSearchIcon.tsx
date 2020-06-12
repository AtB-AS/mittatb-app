import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function InputSearchIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 24a8 8 0 100-16 8 8 0 000 16zm0 4c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.586 22.586a2 2 0 012.828 0l10 10a2 2 0 11-2.828 2.828l-10-10a2 2 0 010-2.828z"
      />
    </Svg>
  );
}

export default InputSearchIcon;
