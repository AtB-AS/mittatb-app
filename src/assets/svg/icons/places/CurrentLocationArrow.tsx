import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgCurrentLocationArrow(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M35.414 4.586a2 2 0 01.424 2.202l-12 28a2 2 0 01-3.735-.155L16.419 23.58 5.368 19.897a2 2 0 01-.156-3.735l28-12a2 2 0 012.202.424zm-23.791 13.18l7.01 2.337a2 2 0 011.264 1.264l2.337 7.01 7.958-18.57-18.57 7.96z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgCurrentLocationArrow;
