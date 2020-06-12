import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAdjust(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M14 14a4 4 0 10-3.465-6H6a2 2 0 100 4h4.535A3.998 3.998 0 0014 14zm12 10a4 4 0 10-3.465-6H6a2 2 0 100 4h16.535A3.998 3.998 0 0026 24zm-8 6a4 4 0 01-7.465 2H6a2 2 0 110-4h4.535A4 4 0 0118 30zm16 2H19.659A5.99 5.99 0 0020 30a5.99 5.99 0 00-.341-2H34a2 2 0 110 4zm-2.341-10H34a2 2 0 100-4h-2.341A5.99 5.99 0 0132 20a5.99 5.99 0 01-.341 2zM34 12H19.659A5.99 5.99 0 0020 10a5.99 5.99 0 00-.341-2H34a2 2 0 110 4z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgAdjust;
