import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgAssistant(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path
        fillRule="evenodd"
        d="M8 1a7 7 0 104.192 12.606l5.1 5.101 1.415-1.414-5.1-5.1A7 7 0 008 1zM3 8a5 5 0 1110 0A5 5 0 013 8z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgAssistant;
