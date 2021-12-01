import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgDate(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M16 24v-4h-4v4h4z" />
      <Path
        fillRule="evenodd"
        d="M14 4h-4v4a6 6 0 00-6 6v16a6 6 0 006 6h20a6 6 0 006-6V14a6 6 0 00-6-6V4h-4v4H14V4zM8 30V16h24v14a2 2 0 01-2 2H10a2 2 0 01-2-2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgDate;
