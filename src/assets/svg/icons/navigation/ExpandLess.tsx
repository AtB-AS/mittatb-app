import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgExpandLess(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M6.586 27.414a2 2 0 002.828 0L20 16.828l10.586 10.586a2 2 0 102.828-2.828l-12-12a2 2 0 00-2.828 0l-12 12a2 2 0 000 2.828z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgExpandLess;
