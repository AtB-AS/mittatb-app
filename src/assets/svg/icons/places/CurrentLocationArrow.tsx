import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgCurrentLocationArrow(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 40 40" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M33.414 6.586a2 2 0 01.453 2.132l-10 26a2 2 0 01-3.764-.086l-3.684-11.05-11.051-3.685a2 2 0 01-.086-3.764l26-10a2 2 0 012.132.453zm-21.493 11.28l6.712 2.237a2 2 0 011.264 1.264l2.238 6.712 6.383-16.597-16.597 6.384z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgCurrentLocationArrow;
