import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgSwap(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M26 28a2 2 0 104 0V12.828l2.586 2.586a2 2 0 102.828-2.828L29.42 6.59A1.992 1.992 0 0028 6a1.994 1.994 0 00-1.413.585l-6 6a2 2 0 102.828 2.828L26 12.828V28zm-14.766 5.848a1.994 1.994 0 002.18-.434l6-6a2 2 0 10-2.828-2.828L14 27.172V12a2 2 0 10-4 0v15.172l-2.586-2.586a2 2 0 10-2.828 2.828l5.998 5.999.015.015c.189.185.405.325.635.42z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgSwap;
