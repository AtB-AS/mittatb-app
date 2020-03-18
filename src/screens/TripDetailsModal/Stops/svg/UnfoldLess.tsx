import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function UnfoldLess(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path
        d="M13.8281 4.49219L10 8.32031L6.17188 4.49219L7.34375 3.32031L10 5.97656L12.6562 3.32031L13.8281 4.49219ZM6.17188 15.5078L10 11.6797L13.8281 15.5078L12.6562 16.6797L10 14.0234L7.34375 16.6797L6.17188 15.5078Z"
        fill="black"
      />
    </Svg>
  );
}

export default UnfoldLess;
