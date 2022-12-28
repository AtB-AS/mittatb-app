import {useTheme} from '@atb/theme';
import {
  TextColor,
  Theme,
  Mode,
  StaticColor,
  isStaticColor,
  flatStaticColors,
  isStatusColor,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import useFontScale from '@atb/utils/use-font-scale';

type IconColor = StaticColor | TextColor;

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: IconColor;
  size?: keyof Theme['icon']['size'];
} & SvgProps;

export const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  fill,
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
  return svg(settings);
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
