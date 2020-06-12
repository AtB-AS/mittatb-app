import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgExpand(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M6.586 12.586a2 2 0 012.828 0L20 23.172l10.586-10.586a2 2 0 112.828 2.828l-12 12a2 2 0 01-2.828 0l-12-12a2 2 0 010-2.828z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgExpand;
