import type {PropsWithChildren} from 'react';
import {View, type ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {SwapButton} from './SwapButton';
import type {ContrastColor} from '@atb-as/theme';

type Props = PropsWithChildren<{
  onPress: () => void;
  backgroundColor: ContrastColor;
  horizontalPosition: 'left' | 'right';
  buttonIsVisible?: boolean;
  swapButtonStyleOverride?: ViewStyle;
}>;

export function WithSwapButton({
  children,
  horizontalPosition,
  onPress,
  backgroundColor,
  buttonIsVisible = true,
  swapButtonStyleOverride,
}: Props) {
  const style = useStyle();
  return (
    <View>
      {children}
      {buttonIsVisible && (
        <SwapButton
          style={[
            style.common,
            style.circle,
            style.verticalCenter,
            style[horizontalPosition],
            swapButtonStyleOverride && swapButtonStyleOverride,
          ]}
          onPress={onPress}
          expanded={false}
          backgroundColor={backgroundColor}
          pointerEvents="box-only"
        />
      )}
    </View>
  );
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  circle: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: theme.border.radius.circle,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.border.secondary.foreground.secondary,
  },
  common: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: theme.color.background.neutral['0'].background,
  },
  verticalCenter: {
    top: '50%',
    transform: [{translateY: '-50%'}],
  },
  right: {
    right: theme.spacing.medium,
  },
  left: {
    left: theme.spacing.medium,
  },
}));
