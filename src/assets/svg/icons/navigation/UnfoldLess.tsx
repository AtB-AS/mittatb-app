import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgUnfoldLess(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M20.707 17.293a1 1 0 01-1.414 0l-5.586-5.586c-.63-.63-.184-1.707.707-1.707h11.172c.89 0 1.337 1.077.707 1.707l-5.586 5.586zM14.414 30c-.89 0-1.337-1.077-.707-1.707l5.586-5.586a1 1 0 011.414 0l5.586 5.586c.63.63.184 1.707-.707 1.707H14.414z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgUnfoldLess;
