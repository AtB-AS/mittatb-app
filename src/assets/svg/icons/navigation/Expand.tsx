import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgExpand(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M18.586 27.414a2 2 0 002.828 0l14-14-2.828-2.828L20 23.172 7.414 10.586l-2.828 2.828 14 14z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgExpand;
