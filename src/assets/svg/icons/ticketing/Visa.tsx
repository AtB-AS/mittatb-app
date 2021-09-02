import * as React from 'react';
import Svg, {SvgProps} from 'react-native-svg';

function SvgVisa(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props} />
  );
}

export default SvgVisa;
