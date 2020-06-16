import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgDuration(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M20 34c7.732 0 14-6.268 14-14S27.732 6 20 6 6 12.268 6 20s6.268 14 14 14zm5.235-7.765c.743.743 1.953.796 2.605-.027A9.957 9.957 0 0030 20c0-5.523-4.477-10-10-10-.569 0-1 .482-1 1.051v8.12a2 2 0 00.586 1.415l5.65 5.65z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgDuration;
