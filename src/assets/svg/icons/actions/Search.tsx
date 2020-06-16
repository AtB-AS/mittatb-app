import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgSearch(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M24 16a8 8 0 11-16 0 8 8 0 0116 0zm-1.047 9.782A11.946 11.946 0 0116 28C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12c0 2.592-.822 4.991-2.218 6.953l9.632 9.633a2 2 0 11-2.828 2.828l-9.633-9.633z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgSearch;
