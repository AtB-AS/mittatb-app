import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function BusSide(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 40 40" fill="#000" {...props}>
      <Path d="M31 26a2 2 0 11-4 0 2 2 0 014 0zM13 26a2 2 0 11-4 0 2 2 0 014 0z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.874 25h10.252a4.002 4.002 0 017.748 0H34a2 2 0 002-2v-3.675c0-.215-.035-.429-.103-.633l-1.441-4.325A2 2 0 0032.558 13H6a2 2 0 00-2 2v8a2 2 0 002 2h1.126a4.002 4.002 0 017.748 0zM6 16a1 1 0 011-1h3a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2zm8-1a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zm7 1a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2zm9-1a1 1 0 00-1 1v2.323a1 1 0 00.629.928l2.555 1.023a1 1 0 001.342-1.171l-.837-3.346a1 1 0 00-.97-.757H30z"
      />
    </Svg>
  );
}

export default BusSide;
