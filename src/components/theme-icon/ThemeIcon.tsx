import {useTheme} from '@atb/theme';
import {
  flatStaticColors,
  isStaticColor,
  isStatusColor,
  Mode,
  Theme,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {useFontScale} from '@atb/utils/use-font-scale';
import {View} from 'react-native';
import type {IconColor} from './types';
import {
  NotificationIndicator,
  NotificationIndicatorProps,
} from '@atb/components/theme-icon/NotificationIndicator';
import {LoadingSpinner} from '@atb/components/loading';

export type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: IconColor;
  size?: keyof Theme['icon']['size'];
  notification?: Omit<NotificationIndicatorProps, 'iconSize'>;
  loading?: boolean;
} & SvgProps;

export const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  fill,
  notification,
  style,
  loading,
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
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {svg(settings)}
          {notification && (
            <NotificationIndicator {...notification} iconSize={size} />
          )}
        </>
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
