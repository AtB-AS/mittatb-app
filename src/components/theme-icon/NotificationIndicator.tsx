import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIconProps} from './ThemeIcon';
import {
  flatStaticColors,
  isInteractiveColor,
  isStaticColor,
  isStatusColor,
} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';
import type {NotificationColor} from './types';

export type NotificationIndicatorProps = {
  color: NotificationColor;
  /**
   * An optional background color that will be applied as a border/spacing
   * around the indicator. Use the same color as the background under the
   * ThemeIcon to make the notification indicator "pop" out a little more.
   */
  backgroundColor?: NotificationColor;
  iconSize: ThemeIconProps['size'];
};

export const NotificationIndicator = ({
  color,
  backgroundColor,
  iconSize,
}: NotificationIndicatorProps) => {
  const styles = useStyles();
  const notificationColor = useNotificationColor(color);
  const borderColor = useNotificationColor(backgroundColor);
  const fontScale = useFontScale();
  const indicatorSize = getIndicatorSize(iconSize, !!borderColor, fontScale);
  const borderWidth = (iconSize === 'xSmall' ? 1 : 2) * fontScale;
  return (
    <View
      style={{
        ...styles.indicator,
        borderWidth: borderColor ? borderWidth : 0,
        borderColor,
        height: indicatorSize,
        width: indicatorSize,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: notificationColor,
        }}
      />
    </View>
  );
};

function useNotificationColor(color?: NotificationColor): string | undefined {
  const {theme, themeName} = useTheme();
  if (!color) return undefined;
  if (typeof color !== 'string') {
    return color.background;
  } else if (isStatusColor(color)) {
    return theme.status[color].primary.background;
  } else if (isStaticColor(color)) {
    return flatStaticColors[themeName][color].background;
  } else if (isInteractiveColor(color)) {
    return theme.interactive[color].outline.background;
  } else {
    return theme.text.colors[color];
  }
}

const getIndicatorSize = (
  size: ThemeIconProps['size'],
  hasBorder: boolean,
  fontScale: number,
) => {
  switch (size) {
    case 'xSmall':
      return (hasBorder ? 6 : 5) * fontScale;
    case 'small':
      return (hasBorder ? 8 : 7) * fontScale;
    case 'normal':
      return (hasBorder ? 11 : 9) * fontScale;
    case 'large':
      return (hasBorder ? 13 : 11) * fontScale;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  indicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: theme.border.radius.circle,
    zIndex: 10,
    overflow: 'hidden',
  },
}));
