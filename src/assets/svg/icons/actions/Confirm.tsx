import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgConfirm(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M16 27.172L34.586 8.586l2.828 2.828-20 20a2 2 0 01-2.828 0l-10-10 2.828-2.828L16 27.172z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgConfirm;
