import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {SvgProps} from 'react-native-svg';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {OverlayButton} from './OverlayButton';

type Props = PropsWithChildren<{
  svgIcon(props: SvgProps): React.JSX.Element;
  overlayPosition: 'left' | 'right';
  isLoading?: boolean;
  onPress?: () => void;
  buttonStyleOverride?: StyleProp<ViewStyle>;
}>;

export function WithOverlayButton({
  children,
  svgIcon,
  overlayPosition = 'right',
  isLoading,
  onPress,
  buttonStyleOverride,
}: Props) {
  const {theme} = useThemeContext();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {isLoading ? (
        <ActivityIndicator color={theme.color.foreground.dynamic.primary} />
      ) : (
        <OverlayButton
          svgIcon={svgIcon}
          onPress={onPress}
          style={[styles.button, styles[overlayPosition], buttonStyleOverride]}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  button: {
    position: 'absolute',
    zIndex: 2,
  },
  right: {
    right: theme.spacing.medium,
  },
  left: {
    left: theme.spacing.medium,
  },
}));
