import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {SvgProps} from 'react-native-svg';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';

type Props = PropsWithChildren<{
  svgIcon(props: SvgProps): React.JSX.Element;
  overlayPosition: 'left' | 'right';
  isLoading?: boolean;
  onPress: () => void;
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
        <Button
          rightIcon={{svg: svgIcon}}
          mode="primary"
          expanded={false}
          onPress={onPress}
          style={[
            styles.circleBorder,
            styles.button,
            styles[overlayPosition],
            buttonStyleOverride,
          ]}
          interactiveColor={theme.color.interactive[2]}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
  button: {
    position: 'absolute',
    zIndex: 2,
  },
  circleBorder: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.color.border.primary.background,
    borderRadius: theme.border.radius.circle,
  },
  right: {
    right: theme.spacing.medium,
  },
  left: {
    left: theme.spacing.medium,
  },
}));
