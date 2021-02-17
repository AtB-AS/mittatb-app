import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgEdit(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M26.586 4.586a2 2 0 012.828 0l6 6a2 2 0 010 2.828l-22 22A2 2 0 0112 36H6a2 2 0 01-2-2v-6a2 2 0 01.586-1.414l22-22zM24.828 12L28 15.172 31.172 12 28 8.828 24.828 12zm.344 6L22 14.828 10.845 25.983a8.037 8.037 0 013.172 3.172L25.172 18zM10.874 32A4.007 4.007 0 008 29.126V32h2.874z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgEdit;
