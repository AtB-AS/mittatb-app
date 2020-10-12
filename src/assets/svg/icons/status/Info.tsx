import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgInfo(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M22 12v4h-4v-4h4zm-4 6v10h4V18h-4z" />
      <Path
        fillRule="evenodd"
        d="M2 20c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18S2 29.941 2 20zM20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgInfo;
