import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';

const TouchableOpacityOrView = ({
  style,
  onClick,
  children,
  accessibilityHint,
  accessibilityLabel,
}: {
  style: ViewStyle;
  children: ReactNode;
  onClick?: () => void;
  accessibilityHint?: string;
  accessibilityLabel?: string;
}) => {
  return onClick ? (
    <TouchableOpacity
      onPress={onClick}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View style={style}>{children}</View>
  );
};

export {TouchableOpacityOrView};
