import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgConfirm(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M8 13.586l9.293-9.293 1.414 1.414-10 10a1 1 0 01-1.414 0l-5-5 1.414-1.414L8 13.586z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgConfirm;
