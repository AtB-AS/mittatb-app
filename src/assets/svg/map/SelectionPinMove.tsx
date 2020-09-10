import * as React from 'react';
import Svg, {Path, Circle, SvgProps} from 'react-native-svg';

function SvgSelectionPinMove(props: SvgProps) {
  return (
    <Svg width={28} height={37} fill="none" viewBox="0 0 28 37" {...props}>
      <Path
        fill="#fff"
        d="M10.764 33.835a46.471 46.471 0 01-4.313-4.584C3.364 25.472 0 20.018 0 14 0 6.268 6.268 0 14 0s14 6.268 14 14c0 6.018-3.364 11.472-6.451 15.25a46.471 46.471 0 01-4.313 4.585C16.062 34.925 14 36.538 14 36.538s-2.062-1.613-3.236-2.703z"
      />
      <Path
        fill="#71D6E0"
        fillRule="evenodd"
        d="M14 34s12-9.373 12-20c0-6.627-5.373-12-12-12S2 7.373 2 14c0 10.627 12 20 12 20z"
        clipRule="evenodd"
      />
      <Circle cx={14} cy={14} r={3} fill="#fff" />
    </Svg>
  );
}

export default SvgSelectionPinMove;
