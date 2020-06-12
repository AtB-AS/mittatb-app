import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgUnfoldMore(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M20.707 10.707a1 1 0 00-1.414 0l-5.586 5.586c-.63.63-.184 1.707.707 1.707h11.172c.89 0 1.337-1.077.707-1.707l-5.586-5.586zM14.414 22c-.89 0-1.337 1.077-.707 1.707l5.586 5.586a1 1 0 001.414 0l5.586-5.586c.63-.63.184-1.707-.707-1.707H14.414z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgUnfoldMore;
