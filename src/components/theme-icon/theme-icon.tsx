import {useTheme} from '@atb/theme';
import {Statuses, TextColor, Theme} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: TextColor | Statuses;
  size?: keyof Theme['icon']['size'];
} & SvgProps;

const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();

  let fill = isStatuses(colorType, theme)
    ? theme.status[colorType].main.backgroundColor
    : theme.text.colors[colorType ?? 'primary'];

  const settings = {
    fill,
    height: theme.icon.size[size],
    width: theme.icon.size[size],
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;

function isStatuses(a: any, theme: Theme): a is Statuses {
  return a in theme.status;
}
