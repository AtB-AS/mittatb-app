import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAssistant(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 16 16" fill="black" {...props}>
      <Path
        fillRule="evenodd"
        d="M10 6a4 4 0 11-8 0 4 4 0 018 0zm-.523 4.89a6 6 0 111.414-1.414l4.816 4.817a1 1 0 01-1.414 1.414l-4.816-4.816z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgAssistant;
