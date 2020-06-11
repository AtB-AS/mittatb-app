import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function TrainSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="none" {...props}>
      <Path d="M4 28h30v-2H4v2z" fill="#000" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.764 24H4V12h23.172a2 2 0 011.414.586l6.395 6.395a2 2 0 01.374 2.308l-.802 1.605A2 2 0 0132.763 24zm-5.85-10c-.89 0-1.337 1.077-.707 1.707l1 1a1 1 0 00.707.293h.172c.89 0 1.337-1.077.707-1.707l-1-1a1 1 0 00-.707-.293h-.172z"
        fill="#000"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.414 9a1 1 0 011-1h4a1 1 0 01.707 1.707l-4 4a1 1 0 01-1.414-1.414L20 10h-1.586a1 1 0 01-1-1z"
        fill="#000"
      />
    </Svg>
  );
}

export default TrainSide;
