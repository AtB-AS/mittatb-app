import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function CancelCrossIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M15.8203 5.35156L11.1719 10L15.8203 14.6484L14.6484 15.8203L10 11.1719L5.35156 15.8203L4.17969 14.6484L8.82812 10L4.17969 5.35156L5.35156 4.17969L10 8.82812L14.6484 4.17969L15.8203 5.35156Z" />
    </Svg>
  );
}

export default CancelCrossIcon;
