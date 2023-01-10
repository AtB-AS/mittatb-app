import {useTheme} from '@atb/theme';
import {
  flatStaticColors,
  isStaticColor,
  isStatusColor,
  Mode,
  Theme,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import useFontScale from '@atb/utils/use-font-scale';
import {View} from 'react-native';
import type {IconColor, NotificationColor} from './types';
import {NotificationIndicator} from '@atb/components/theme-icon/NotificationIndicator';

export type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: IconColor;
  size?: keyof Theme['icon']['size'];
  notificationColor?: NotificationColor;
} & SvgProps;

export const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  fill,
  notificationColor,
  style,
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme, themeName} = useTheme();

  const fillToUse = fill || getFill(theme, themeName, colorType);

  const fontScale = useFontScale();
  const iconSize = theme.icon.size[size] * fontScale;

  const settings = {
    fill: fillToUse,
    height: iconSize,
    width: iconSize,
    ...props,
  };

  return (
    <View style={style}>
      {svg(settings)}
      {notificationColor && (
        <NotificationIndicator color={notificationColor} iconSize={size} />
      )}
    </View>
  );
};

function getFill(theme: Theme, themeType: Mode, colorType?: IconColor): string {
  if (isStatusColor(colorType)) {
    return theme.static.status[colorType].background;
  } else if (isStaticColor(colorType)) {
    return flatStaticColors[themeType][colorType].text;
  } else {
    return theme.text.colors[colorType ?? 'primary'];
  }
}
