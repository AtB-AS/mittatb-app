import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgClose(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M20 22.828l10.586 10.586 2.828-2.828L22.828 20 33.414 9.414l-2.828-2.828L20 17.172 9.414 6.586 6.586 9.414 17.172 20 6.586 30.586l2.828 2.828L20 22.828z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgClose;
