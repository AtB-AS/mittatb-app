import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgChevronRight(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M21.172 20l-6.586-6.586 2.828-2.828 8 8a2 2 0 010 2.828l-8 8-2.828-2.828L21.172 20z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgChevronRight;
