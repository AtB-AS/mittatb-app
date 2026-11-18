import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIconProps} from './ThemeIcon';
import {ContrastColor} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';

export type NotificationIndicatorProps = {
  color: ContrastColor;
  /**
   * An optional background color that will be applied as a border/spacing
   * around the indicator. Use the same color as the background under the
   * ThemeIcon to make the notification indicator "pop" out a little more.
   */
  backgroundColor?: ContrastColor;
  iconSize: ThemeIconProps['size'];
};

export const NotificationIndicator = ({
  color,
  backgroundColor,
  iconSize,
}: NotificationIndicatorProps) => {
  const styles = useStyles();
  const notificationColor = color.background;
  const borderColor = backgroundColor?.background;
  const fontScale = useFontScale();
  const borderWidth = (iconSize === 'xSmall' ? 1 : 2) * fontScale;
  const dotSize = getDotSize(iconSize) * fontScale;
  // The border is drawn inside the view, so add it to keep the dot size
  const indicatorSize = borderColor ? dotSize + borderWidth * 2 : dotSize;
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

const getDotSize = (size: ThemeIconProps['size']) => {
  switch (size) {
    case 'xSmall':
      return 6;
    case 'small':
      return 8;
    case 'large':
      return 12;
    case 'normal':
    default:
      return 10;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  indicator: {
    position: 'absolute',
    right: -4,
    top: -2,
    borderRadius: theme.border.radius.large,
    zIndex: 10,
    overflow: 'hidden',
  },
}));
