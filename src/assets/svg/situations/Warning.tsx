import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgWarning(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <Path fill="#F7F3B2" d="M7 2h6l5 5v6l-5 5H7l-5-5V7l5-5z" />
      <Path
        fill="#E4D700"
        fillRule="evenodd"
        d="M6.293 1.293A1 1 0 017 1h6a1 1 0 01.707.293l5 5A1 1 0 0119 7v6a1 1 0 01-.293.707l-5 5A1 1 0 0113 19H7a1 1 0 01-.707-.293l-5-5A1 1 0 011 13V7a1 1 0 01.293-.707l5-5zM7.414 3L3 7.414v5.172L7.414 17h5.172L17 12.586V7.414L12.586 3H7.414z"
        clipRule="evenodd"
      />
      <Path fill="#000" d="M9 6v5h2V6H9zm2 6H9v2h2v-2z" />
    </Svg>
  );
}

export default SvgWarning;
