import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIconProps} from './ThemeIcon';
import {
  flatStaticColors,
  isInteractiveColor,
  isStaticColor,
  isStatusColor,
  Mode,
} from '@atb/theme/colors';
import type {NotificationColor} from './types';

export const NotificationIndicator = ({
  color,
  iconSize,
}: {
  color: NotificationColor;
  iconSize: ThemeIconProps['size'];
}) => {
  const {theme, themeName} = useTheme();
  const notificationColor = getNotificationColor(theme, themeName, color);
  const styles = useStyles();
  const indicatorSize = getIndicatorSize(iconSize);
  return (
    <View
      style={{
        ...styles.indicator,
        backgroundColor: notificationColor,
        height: indicatorSize,
        width: indicatorSize,
      }}
    />
  );
};

function getNotificationColor(
  theme: Theme,
  themeType: Mode,
  colorType: NotificationColor,
): string {
  if (isStatusColor(colorType)) {
    return theme.static.status[colorType].background;
  } else if (isStaticColor(colorType)) {
    return flatStaticColors[themeType][colorType].background;
  } else if (isInteractiveColor(colorType)) {
    return theme.interactive[colorType].outline.background;
  } else {
    return theme.text.colors[colorType];
  }
}

const getIndicatorSize = (size: ThemeIconProps['size']) => {
  switch (size) {
    case 'small':
      return 4;
    case 'large':
      return 8;
    default:
      return 6;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  indicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: theme.border.radius.circle,
    zIndex: 10,
  },
}));
