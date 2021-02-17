import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgExpandLess(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M18.586 10.586a2 2 0 012.828 0l14 14-2.828 2.828L20 14.828 7.414 27.414l-2.828-2.828 14-14z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgExpandLess;
