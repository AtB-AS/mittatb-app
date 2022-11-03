import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';

const TouchableOpacityOrView = ({
  style,
  onClick,
  children,
}: {
  style: ViewStyle;
  children: ReactNode;
  onClick?: () => void;
}) => {
  return onClick ? (
    <TouchableOpacity onPress={onClick} style={style}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={style}>{children}</View>
  );
};

export {TouchableOpacityOrView};
