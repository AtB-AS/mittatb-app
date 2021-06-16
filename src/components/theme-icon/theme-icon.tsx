import {useTheme} from '@atb/theme';
import {
  isThemeColor,
  Statuses,
  TextColor,
  Theme,
  ThemeColor,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import useFontScale from '@atb/utils/use-font-scale';

type ColorType = TextColor | Statuses | ThemeColor;

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
  const {theme} = useTheme();

  const fill = getFill(theme, colorType);

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

function getFill(theme: Theme, colorType?: ColorType): string {
  if (isThemeColor(theme, colorType)) {
    return theme.colors[colorType].color;
  } else if (isStatuses(colorType, theme)) {
    return theme.status[colorType].main.backgroundColor;
  } else {
    return theme.text.colors[colorType ?? 'primary'];
  }
}

function isStatuses(a: any, theme: Theme): a is Statuses {
  return a in theme.status;
}
