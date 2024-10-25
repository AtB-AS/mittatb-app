import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIconProps} from './ThemeIcon';
import {
  ContrastColor,
} from '@atb/theme/colors';
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

const getIndicatorSize = (
  size: ThemeIconProps['size'],
  hasBorder: boolean,
  fontScale: number,
) => {
  switch (size) {
    case 'xSmall':
      return (hasBorder ? 6 : 4) * fontScale;
    case 'small':
      return (hasBorder ? 8 : 6) * fontScale;
    case 'normal':
      return (hasBorder ? 10 : 6) * fontScale;
    case 'large':
      return (hasBorder ? 12 : 8) * fontScale;
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
