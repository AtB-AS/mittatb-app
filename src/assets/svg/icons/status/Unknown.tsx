import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgUnknown(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M22 26v4h-4v-4h4z" />
      <Path
        fillRule="evenodd"
        d="M18 16a2 2 0 112.958 1.757c-.62.34-1.317.824-1.88 1.481C18.506 19.905 18 20.84 18 22v2h4v-1.988a.603.603 0 01.114-.17c.153-.179.416-.386.764-.577A6 6 0 1014 16h4zm3.998 6.02v.003l.001-.008-.001.004z"
        clipRule="evenodd"
      />
      <Path
        fillRule="evenodd"
        d="M2 20c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18S2 29.941 2 20zM20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgUnknown;
