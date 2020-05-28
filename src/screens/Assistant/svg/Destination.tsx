import * as React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

function DestinationIcon(props: SvgProps) {
  const {fill = '#5F686E', ...rest} = props;

  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill={fill} {...rest}>
      <Path d="M4.5 5.00067C4.5 4.44839 4.94772 4.00067 5.5 4.00067H14.0858C14.9767 4.00067 15.4229 5.07781 14.7929 5.70778L13.2071 7.29357C12.8166 7.68409 12.8166 8.31725 13.2071 8.70778L14.7929 10.2936C15.4229 10.9235 14.9767 12.0007 14.0858 12.0007H5.5C4.94772 12.0007 4.5 11.553 4.5 11.0007V5.00067Z" />
      <Rect x="4.5" y="10.0007" width="2" height="6" rx="1" />
    </Svg>
  );
}

export default DestinationIcon;
