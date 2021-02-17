import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgArrowLeft(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M4.586 18.586l10-10 2.828 2.828L10.828 18H36v4H10.828l6.586 6.586-2.828 2.828-10-10a2 2 0 010-2.828z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgArrowLeft;
