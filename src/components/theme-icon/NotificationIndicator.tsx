import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIconProps} from './ThemeIcon';
import {
  flatStaticColors,
  isInteractiveColor,
  isStaticColor,
  isStatusColor,
} from '@atb/theme/colors';
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
  const indicatorSize = getIndicatorSize(iconSize, !!borderColor);
  return (
    <View
      style={{
        ...styles.indicator,
        borderWidth: borderColor ? (iconSize === 'small' ? 1 : 2) : 0,
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
  if (isStatusColor(color)) {
    return theme.static.status[color].background;
  } else if (isStaticColor(color)) {
    return flatStaticColors[themeName][color].background;
  } else if (isInteractiveColor(color)) {
    return theme.interactive[color].outline.background;
  } else {
    return theme.text.colors[color];
  }
}

const getIndicatorSize = (size: ThemeIconProps['size'], hasBorder: boolean) => {
  switch (size) {
    case 'small':
      return hasBorder ? 6 : 4;
    case 'large':
      return hasBorder ? 12 : 8;
    default:
      return hasBorder ? 10 : 6;
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
