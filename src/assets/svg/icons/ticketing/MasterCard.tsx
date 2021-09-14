import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

function SvgMasterCard(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path fill="#FF5F00" d="M24.868 11.38h-9.735v17.492h9.735V11.38z" />
      <Path
        fill="#EB001B"
        d="M15.751 20.125a11.106 11.106 0 014.25-8.746 11.124 11.124 0 100 17.493 11.105 11.105 0 01-4.25-8.747z"
      />
      <Path
        fill="#F79E1B"
        d="M38 20.125a11.125 11.125 0 01-18 8.747 11.128 11.128 0 000-17.493 11.125 11.125 0 0118 8.746z"
      />
    </Svg>
  );
}

export default SvgMasterCard;
