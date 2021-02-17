import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgUnfoldMore(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M21.414 6.586a2 2 0 00-2.828 0l-8 8 2.828 2.828L20 10.828l6.586 6.586 2.828-2.828-8-8zM10.586 25.414l8 8a2 2 0 002.828 0l8-8-2.828-2.828L20 29.172l-6.586-6.586-2.828 2.828z" />
    </Svg>
  );
}

export default SvgUnfoldMore;
