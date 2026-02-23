import {
  type AccessibilityProps,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {SvgProps} from 'react-native-svg';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {Loading} from '../loading';

type Props = PropsWithChildren<
  {
    svgIcon(props: SvgProps): React.JSX.Element;
    overlayPosition: 'left' | 'right';
    isLoading?: boolean;
    onPress: () => void;
    overlayStyleOverride?: StyleProp<ViewStyle>;
  } & AccessibilityProps
>;

export function WithOverlayButton({
  children,
  svgIcon,
  overlayPosition = 'right',
  isLoading,
  onPress,
  overlayStyleOverride,
  ...props
}: Props) {
  const {theme} = useThemeContext();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      <View
        style={[
          styles.overlayContainer,
          styles[overlayPosition],
          overlayStyleOverride,
        ]}
      >
        {isLoading ? (
          <View style={[styles.border, styles.loading]}>
            <Loading
              color={theme.color.foreground.dynamic.primary}
              size="small"
            />
          </View>
        ) : (
          <Button
            rightIcon={{svg: svgIcon}}
            mode="primary"
            expanded={false}
            onPress={onPress}
            interactiveColor={theme.color.interactive[2]}
            style={styles.border}
            {...props}
          />
        )}
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    justifyContent: 'center',
  },
  children: {
    width: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  border: {
    borderColor: theme.color.background.neutral[3].background,
    borderWidth: theme.border.width.slim,
  },
  loading: {
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.circle,
    backgroundColor: theme.color.interactive[2].default.background,
  },
  right: {
    right: theme.spacing.medium,
  },
  left: {
    left: theme.spacing.medium,
  },
}));
