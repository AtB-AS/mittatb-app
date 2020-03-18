import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function UnfoldMore(props: SvgProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M10 15.1562L12.6562 12.5L13.8281 13.6719L10 17.5L6.17188 13.6719L7.34375 12.5L10 15.1562ZM10 4.84375L7.34375 7.5L6.17188 6.32812L10 2.5L13.8281 6.32812L12.6562 7.5L10 4.84375Z" />
    </Svg>
  );
}

export default UnfoldMore;
