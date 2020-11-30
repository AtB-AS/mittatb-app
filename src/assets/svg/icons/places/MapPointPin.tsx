import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgMapPointPin(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 20 20" {...props}>
      <Path d="M10 6a2 2 0 100 4 2 2 0 000-4z" />
      <Path
        fillRule="evenodd"
        d="M9.097 18.552a23.244 23.244 0 01-2.871-2.927C4.682 13.736 3 11.01 3 8a7 7 0 0114 0c0 3.01-1.682 5.736-3.226 7.625a23.251 23.251 0 01-2.943 2.993c-.001.003-.001.003-.215.17a1 1 0 01-1.232 0 3.036 3.036 0 01-.287-.236zM10 3a5 5 0 00-5 5c0 2.305 1.318 4.578 2.774 6.36A21.24 21.24 0 0010 16.687a21.233 21.233 0 002.226-2.327C13.682 12.578 15 10.305 15 8a5 5 0 00-5-5z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgMapPointPin;
