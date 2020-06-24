import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgEdit(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M26.364 7.98a1 1 0 011.414 0l4.243 4.242a1 1 0 010 1.414l-2.122 2.121-5.656-5.656 2.12-2.122zm-3.536 3.535l5.657 5.657-11.313 11.313-5.657-5.657 11.313-11.313zm-7.07 18.384L10.1 24.243l-1.57 6.005a1 1 0 001.221 1.22l6.005-1.569z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgEdit;
