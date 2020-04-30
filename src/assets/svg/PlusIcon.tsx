import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function PlusIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M15.8203 10.8203H10.8203V15.8203H9.17969V10.8203H4.17969V9.17969H9.17969V4.17969H10.8203V9.17969H15.8203V10.8203Z" />
    </Svg>
  );
}

export default PlusIcon;
