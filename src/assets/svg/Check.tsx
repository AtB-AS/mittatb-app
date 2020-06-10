import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="black" {...props}>
      <Path d="M31.938 60.063l36-36-5.626-5.813-30.374 30.375-14.25-14.25L12.063 40l19.874 20.063zm-20.25-48.188C19.561 4 29 .062 40 .062S60.375 4 68.125 11.876C76 19.625 79.938 29 79.938 40S76 60.438 68.124 68.313C60.375 76.063 51 79.936 40 79.936s-20.438-3.874-28.313-11.624C3.938 60.437.063 51 .063 40s3.874-20.375 11.624-28.125z" />
    </Svg>
  );
}

export default SvgComponent;
