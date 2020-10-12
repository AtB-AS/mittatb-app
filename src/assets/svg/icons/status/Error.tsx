import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgError(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M22 26v4h-4v-4h4zm-4-10v8h4v-8h-4z" />
      <Path
        fillRule="evenodd"
        d="M20 4a2 2 0 011.736 1.008l16 28A2 2 0 0136 36H4a2 2 0 01-1.736-2.992l16-28A2 2 0 0120 4zm12.554 28L20 10.031 7.446 32h25.108z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgError;
