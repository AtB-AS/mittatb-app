import React from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {type StyleProp, type ViewStyle} from 'react-native';
import type {SvgProps} from 'react-native-svg';

type Props = {
  svgIcon(props: SvgProps): React.JSX.Element;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function OverlayButton({svgIcon, onPress, style}: Props) {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <PressableOpacity
      style={[styles.circle, style]}
      accessibilityLabel={
        t(TripSearchTexts.location.swapButton.a11yLabel) + screenReaderPause
      }
      accessible
      accessibilityRole="button"
      onPress={onPress}
    >
      <ThemeIcon svg={svgIcon} size="normal" />
    </PressableOpacity>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  circle: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: theme.border.radius.circle,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.border.secondary.foreground.secondary,
    backgroundColor: theme.color.background.neutral[0].background,
  },
}));
