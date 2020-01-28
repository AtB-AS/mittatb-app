import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function WorkIcon(props: SvgProps) {
  return (
    <Svg width={29} height={26} viewBox="0 0 29 26" fill="none" {...props}>
      <Path
        d="M23.323 17.25v2.855h-2.855V17.25h2.855zm0-5.645v2.79h-2.855v-2.79h2.855zm2.855 11.29V8.75H14.823v2.855h2.855v2.79h-2.855v2.855h2.855v2.855h-2.855v2.79h11.355zm-14.21-17v-2.79h-2.79v2.79h2.79zm0 5.71V8.75h-2.79v2.855h2.79zm0 5.645v-2.855h-2.79v2.855h2.79zm0 5.645v-2.79h-2.79v2.79h2.79zm-5.645-17v-2.79H3.468v2.79h2.855zm0 5.71V8.75H3.468v2.855h2.855zm0 5.645v-2.855H3.468v2.855h2.855zm0 5.645v-2.79H3.468v2.79h2.855zm8.5-17h14.145V25.75H.678V.25h14.145v5.645z"
        fill="#000"
      />
    </Svg>
  );
}

export default WorkIcon;
