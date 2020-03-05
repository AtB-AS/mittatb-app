import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

export default function EditIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path
        d="M17.2656 5.85938L15.7422 7.38281L12.6172 4.25781L14.1406 2.73438C14.2969 2.57812 14.4922 2.5 14.7266 2.5C14.9609 2.5 15.1562 2.57812 15.3125 2.73438L17.2656 4.6875C17.4219 4.84375 17.5 5.03906 17.5 5.27344C17.5 5.50781 17.4219 5.70312 17.2656 5.85938ZM2.5 14.375L11.7188 5.15625L14.8438 8.28125L5.625 17.5H2.5V14.375Z"
      />
    </Svg>
  );
}
