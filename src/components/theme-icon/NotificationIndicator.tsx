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

export const NotificationIndicator = ({
  color,
  iconSize,
}: {
  color: NotificationColor;
  iconSize: ThemeIconProps['size'];
}) => {
  const styles = useStyles();
  const notificationColor = useNotificationColor(color);
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

function useNotificationColor(color: NotificationColor): string {
  const {theme, themeName} = useTheme();
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
