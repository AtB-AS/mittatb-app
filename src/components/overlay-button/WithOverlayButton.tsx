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
      <View
        style={[
          styles.background,
          styles.button,
          styles[overlayPosition],
          buttonStyleOverride,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator
            color={theme.color.foreground.dynamic.primary}
            style={styles.activityIndicator}
            size="small"
          />
        ) : (
          <Button
            rightIcon={{svg: svgIcon}}
            mode="primary"
            expanded={false}
            onPress={onPress}
            interactiveColor={theme.color.interactive[2]}
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
  content: {
    width: '100%',
  },
  button: {
    position: 'absolute',
    zIndex: 2,
  },
  activityIndicator: {
    padding: theme.spacing.medium,
    margin: theme.spacing.xSmall / 2, // To compensate for smaller ActivityIndicator size
  },
  background: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.color.border.primary.background,
    borderRadius: theme.border.radius.circle,
    // Setting backgroundColor here is necessary for the ActivityIndicator
    backgroundColor: theme.color.interactive[2].default.background,
  },
  right: {
    right: theme.spacing.medium,
  },
  left: {
    left: theme.spacing.medium,
  },
}));
