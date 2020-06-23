import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgBusSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M25.126 25H14.874a4.002 4.002 0 00-7.748 0H6a2 2 0 01-2-2v-8a2 2 0 012-2h26.559a2 2 0 011.897 1.367l1.441 4.325c.068.204.103.418.103.633V23a2 2 0 01-2 2h-1.126a4.002 4.002 0 00-7.748 0zM7 15a1 1 0 00-1 1v2a1 1 0 001 1h3a1 1 0 001-1v-2a1 1 0 00-1-1H7zm6 1a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2zm9-1a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zm7 1a1 1 0 011-1h1.72a1 1 0 01.97.758l.836 3.345a1 1 0 01-1.342 1.17l-2.555-1.022a1 1 0 01-.629-.928V16zM13 26a2 2 0 11-4 0 2 2 0 014 0zm18 0a2 2 0 11-4 0 2 2 0 014 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgBusSide;
