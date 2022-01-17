import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgSubway(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M12.51 15.415V12.5h14.987v2.915H21.46V30h-2.92V15.415h-6.03z" />
      <Path
        fillRule="evenodd"
        d="M2.5 20c0-9.65 7.85-17.5 17.5-17.5S37.5 10.35 37.5 20 29.65 37.5 20 37.5 2.5 29.65 2.5 20zM35 20c0-8.27-6.73-15-15-15-8.273 0-15 6.73-15 15s6.727 15 15 15c8.27 0 15-6.73 15-15z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgSubway;
