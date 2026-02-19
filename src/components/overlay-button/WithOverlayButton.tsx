import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {SvgProps} from 'react-native-svg';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {OverlayButton} from '@atb/components/overlay-button/OverlayButton';

type Props = PropsWithChildren<{
  svgIcon(props: SvgProps): React.JSX.Element;
  horizontalPosition: 'left' | 'right';
  isLoading?: boolean;
  onPress?: () => void;
  buttonStyleOverride?: StyleProp<ViewStyle>;
}>;

export function WithOverlayButton({
  children,
  svgIcon,
  horizontalPosition,
  isLoading,
  onPress,
  buttonStyleOverride,
}: Props) {
  const {theme} = useThemeContext();
  const styles = useStyles();
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator color={theme.color.foreground.dynamic.primary} />
      ) : (
        <OverlayButton
          svgIcon={svgIcon}
          onPress={onPress}
          style={[
            styles.icon,
            styles.verticalCenter,
            styles[horizontalPosition],
            buttonStyleOverride,
          ]}
        />
      )}
      {children}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  icon: {
    position: 'absolute',
    zIndex: 100,
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
