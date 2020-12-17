import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgDelete(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path d="M7.5 15V8h2v7h-2zm3-7v7h2V8h-2z" />
      <Path
        fillRule="evenodd"
        d="M7 2a1 1 0 011-1h4a1 1 0 011 1v2h5v2h-1.5v12a1 1 0 01-1 1h-11a1 1 0 01-1-1V6H2V4h5V2zm2 2h2V3H9v1zM5.5 6v11h9V6h-9z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgDelete;
