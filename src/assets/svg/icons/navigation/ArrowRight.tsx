import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgArrowRight(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M29.172 18l-6.586-6.586 2.828-2.828 10 10a2 2 0 010 2.828l-10 10-2.828-2.828L29.172 22H4v-4h25.172z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgArrowRight;
