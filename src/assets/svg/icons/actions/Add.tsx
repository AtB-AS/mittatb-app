import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAdd(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M18 18V6h4v12h12v4H22v12h-4V22H6v-4h12z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgAdd;
