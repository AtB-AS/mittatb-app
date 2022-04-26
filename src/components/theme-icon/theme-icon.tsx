import {useTheme} from '@atb/theme';
import {
  TextColor,
  Theme,
  Mode,
  StaticColor,
  isStaticColor,
  flatStaticColors,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import useFontScale from '@atb/utils/use-font-scale';

type IconColor = StaticColor | TextColor;

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: IconColor;
  size?: keyof Theme['icon']['size'];
  useTextColor?: boolean;
} & SvgProps;

const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  useTextColor,
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme, themeName} = useTheme();

  const fill = getFill(theme, themeName, colorType, useTextColor);

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

function getFill(
  theme: Theme,
  themeType: Mode,
  colorType?: IconColor,
  useTextColor?: boolean,
): string {
  if (isStaticColor(colorType)) {
    return flatStaticColors[themeType][colorType][
      useTextColor ? 'text' : 'background'
    ];
  } else {
    return theme.text.colors[colorType ?? 'primary'];
  }
}
