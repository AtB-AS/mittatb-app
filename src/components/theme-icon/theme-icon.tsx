import {useTheme} from '@atb/theme';
import {
  Statuses,
  TextColor,
  Theme,
  Mode,
  StaticColor,
  isStaticColor,
  flatStaticColors,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import useFontScale from '@atb/utils/use-font-scale';

type ColorType = TextColor | Statuses | StaticColor;

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: ColorType;
  size?: keyof Theme['icon']['size'];
} & SvgProps;

const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme, themeName} = useTheme();

  const fill = getFill(theme, themeName, colorType);

  const fontScale = useFontScale();
  const iconSize = theme.icon.size[size] * fontScale;

  const settings = {
    fill,
    height: iconSize,
    width: iconSize,
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;

function getFill(theme: Theme, themeType: Mode, colorType?: ColorType): string {
  if (isStaticColor(colorType)) {
    return flatStaticColors[themeType][colorType].background;
  } else {
    return theme.text.colors[colorType ?? 'primary'];
  }
}
