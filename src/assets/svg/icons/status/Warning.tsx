import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgWarning(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path d="M18 12v10h4V12h-4zm4 12h-4v4h4v-4z" />
      <Path
        fillRule="evenodd"
        d="M14 2a2 2 0 00-1.414.586l-10 10A2 2 0 002 14v12a2 2 0 00.586 1.414l10 10A2 2 0 0014 38h12a2 2 0 001.414-.586l10-10A2 2 0 0038 26V14a2 2 0 00-.586-1.414l-10-10A2 2 0 0026 2H14zM6 14.828L14.828 6h10.344L34 14.828v10.344L25.172 34H14.828L6 25.172V14.828z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgWarning;
