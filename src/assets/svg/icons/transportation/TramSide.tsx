import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgTramSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" {...props}>
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M18.414 8a1 1 0 100 2H20l-2 2H7.442a2 2 0 00-1.94 1.515L4.06 19.282a2 2 0 00.151 1.38l1.116 2.232A2 2 0 007.117 24h25.527a2 2 0 001.79-1.106l1.115-2.232a2 2 0 00.152-1.38l-1.442-5.767A2 2 0 0032.319 12h-11.49l2.292-2.293A1 1 0 0022.414 8h-4zm11.466 6a1 1 0 00-1 1v2.323a1 1 0 00.629.928l2.555 1.023a1 1 0 001.342-1.171l-.836-3.346A1 1 0 0031.6 14h-1.72zm-19 1a1 1 0 00-1-1H8.161a1 1 0 00-.97.758l-.836 3.345a1 1 0 001.341 1.17l2.556-1.022a1 1 0 00.628-.928V15zm3-1a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1h-12zm-8 14h28v-2h-28v2z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgTramSide;
