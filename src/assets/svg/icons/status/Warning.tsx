import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgWarning(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path d="M9 6v5h2V6H9zm2 6H9v2h2v-2z" />
      <Path
        fillRule="evenodd"
        d="M7 1a1 1 0 00-.707.293l-5 5A1 1 0 001 7v6a1 1 0 00.293.707l5 5A1 1 0 007 19h6a1 1 0 00.707-.293l5-5A1 1 0 0019 13V7a1 1 0 00-.293-.707l-5-5A1 1 0 0013 1H7zM3 7.414L7.414 3h5.172L17 7.414v5.172L12.586 17H7.414L3 12.586V7.414z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgWarning;
