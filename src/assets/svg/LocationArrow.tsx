import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function LocationArrow(props: SvgProps) {
  return (
    <Svg width={17} height={18} viewBox="0 0 17 18" fill="#000" {...props}>
      <Path d="M1.43 9.663l6.283.024c.117 0 .175.05.175.175l.016 6.267c0 .788.349 1.436 1.005 1.436.63 0 .97-.59 1.27-1.245l6.358-13.696c.158-.324.233-.615.233-.855a.938.938 0 00-.963-.963c-.25 0-.54.066-.864.224L1.247 7.38c-.63.29-1.245.639-1.245 1.278 0 .64.614 1.005 1.428 1.005z" />
    </Svg>
  );
}

export default LocationArrow;
