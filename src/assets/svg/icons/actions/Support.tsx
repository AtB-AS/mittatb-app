import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgSupport(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M12 16a8 8 0 1116 0v8a6 6 0 01-6 6h-4v4h4c4.94 0 9.044-3.583 9.855-8.292A6.003 6.003 0 0031.88 14.3C31.055 8.478 26.05 4 20 4 13.95 4 8.945 8.478 8.12 14.3A6 6 0 0010 26h2V16z" />
    </Svg>
  );
}

export default SvgSupport;
