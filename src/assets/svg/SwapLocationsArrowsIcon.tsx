import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SwapLocationsArrowIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 30a2 2 0 01-2-2V8a2 2 0 114 0v20a2 2 0 01-2 2zM12 34a2 2 0 01-2-2V12a2 2 0 114 0v20a2 2 0 01-2 2z"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.586 15.414a2 2 0 010-2.828l6-6a2 2 0 012.828 0l6 6a2 2 0 11-2.828 2.828L28 10.828l-4.586 4.586a2 2 0 01-2.828 0zM4.586 24.586a2 2 0 012.828 0L12 29.172l4.586-4.586a2 2 0 112.828 2.828l-6 6a2 2 0 01-2.828 0l-6-6a2 2 0 010-2.828z"
      />
    </Svg>
  );
}

export default SwapLocationsArrowIcon;
